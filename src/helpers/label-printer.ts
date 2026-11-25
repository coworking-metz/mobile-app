import {
  AlphaType,
  ColorType,
  Skia,
  type SkImage,
  type SkTypeface,
} from '@shopify/react-native-skia';
import {
  DEVICES,
  LetraTagPrinter,
  LT_PAPER_WHITE,
  parseStatus,
  type LetraTagDevice,
  type PrinterStatus,
  type Transport,
} from '@thermal-label/letratag-web';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleErrorCode, BleManager, State, type Subscription } from 'react-native-ble-plx';
import { create } from 'zustand';
import { log } from '@/helpers/logger';

// Ported from tickets-manager-web `src/helpers/useLabelPrinter.ts`: Web Bluetooth and canvas
// replaced by react-native-ble-plx and Skia, protocol constants kept as calibrated there.

const labelPrinterLogger = log.extend('[label-printer]');

/** @see @thermal-label/letratag-core/data/devices.json */
const ENGINE = DEVICES.LT_200B.engines[0];

/** Label height, in dots (200 dpi): the outer rows of the 32-row frame do not print. */
export const HEAD_DOTS = ENGINE.headDots;

/** Default letter spacing, in em (a fraction of the font size). */
export const DEFAULT_LETTER_SPACING = 0.05;

/** Space available to stick the label on a mug. */
export const LABEL_MAX_LENGTH_MM = 55;

/**
 * Each printed column only advances the tape by ~0.6 dot: labels are rendered stretched along
 * the tape by this factor to keep text proportions (calibrated on real labels).
 */
export const FEED_STRETCH = 1.65;

export const dotsToMm = (dots: number) => (dots * 25.4) / ENGINE.dpi;
export const mmToDots = (mm: number) => Math.round((mm * ENGINE.dpi) / 25.4);

const REFERENCE_FONT_SIZE = 100;

/** The firmware expects 500-byte chunks written with response (the OS splits them, long write). */
const CHUNK_BODY_BYTES = 500;
/** `[0x1B, 0x52, code]` */
const STATUS_FRAME_BYTES = 3;
/** The printer acknowledges the job, then sends its actual result once the label is out. */
const PRINT_RESULT_TIMEOUT_MS = 20_000;
const SCAN_DURATION_MS = 3_000;
// iOS stays `Unknown` while its permission prompt is shown: leave time to answer it
const STATE_TIMEOUT_MS = 30_000;

const BLE = (() => {
  const transport = DEVICES.LT_200B.transports['bluetooth-gatt'];
  if (!transport) throw new Error('LT_200B registry entry is missing the bluetooth-gatt transport');
  return transport;
})();

const PRINTER_DEVICE: LetraTagDevice = {
  ...DEVICES.LT_200B,
  // the encoder appends 6 mm of blank columns: the printer already feeds on its own
  engines: DEVICES.LT_200B.engines.map((engine) => ({ ...engine, forcedTrailingFeedMm: 0 })),
  transports: {
    ...DEVICES.LT_200B.transports,
    // the encoder sizes its chunks as `mtu - 1` body bytes
    'bluetooth-gatt': { ...BLE, mtu: CHUNK_BODY_BYTES + 1 },
  },
};

/** The service UUID tail may vary between units. */
const SERVICE_PREFIX = 'be3dd650-';
/** "Letratag" alone or "DYMO LT-200B…" depending on the firmware. */
const NAME_PREFIXES = ['Letratag', 'LetraTag', 'DYMO LT-200B'];

export type LabelPrinterErrorCode =
  | 'ble'
  | 'bluetooth_off'
  | 'connection_failed'
  | 'no_reply'
  | 'not_connected'
  | 'not_found'
  | 'not_letratag'
  | 'permission_denied'
  // printer status codes: `cassette_missing`, `battery_too_low`…
  | (string & {});

export type LabelPrinterError = { code: LabelPrinterErrorCode; message?: string };
export type ScannedPrinter = { id: string; name: string };

type LabelPrinterState = {
  isScanning: boolean;
  isConnecting: boolean;
  isPrinting: boolean;
  deviceName: string | null;
  /** Filled when the scan found several printers, to let the user pick one. */
  printers: ScannedPrinter[];
  error: LabelPrinterError | null;
};

export const useLabelPrinterStore = create<LabelPrinterState>(() => ({
  isScanning: false,
  isConnecting: false,
  isPrinting: false,
  deviceName: null,
  printers: [],
  error: null,
}));

const setError = (code: LabelPrinterErrorCode, cause?: unknown) => {
  labelPrinterLogger.error(code, cause ?? '');
  useLabelPrinterStore.setState({
    error: { code, message: cause instanceof Error ? cause.message : undefined },
  });
};

export const dismissLabelPrinterError = () => useLabelPrinterStore.setState({ error: null });

// created lazily: instantiating it starts the native BLE stack (and the iOS permission prompt)
let manager: BleManager | null = null;
const getManager = () => (manager ??= new BleManager());

let printer: LetraTagPrinter | null = null;
let readPrintResult: (() => Promise<PrinterStatus>) | null = null;
let disconnectSubscription: Subscription | null = null;

const reset = () => {
  disconnectSubscription?.remove();
  disconnectSubscription = null;
  printer = null;
  readPrintResult = null;
  useLabelPrinterStore.setState({ deviceName: null });
};

// --- Rendering ---

export type RenderedLabel = {
  width: number;
  height: number;
  /** 1-bit black & white RGBA pixels, sent as is to the printer */
  data: Uint8Array;
  image: SkImage;
  /** Printed length, in mm (blank tape around it not counted) */
  lengthMm: number;
};

/**
 * Render text `HEAD_DOTS` high in reading orientation, stretched by `FEED_STRETCH` horizontally
 * (display it `width / FEED_STRETCH` wide to undo it). Same pixels for the preview and the printer.
 */
export const renderLabel = (
  text: string,
  {
    typeface,
    size = HEAD_DOTS,
    letterSpacing = DEFAULT_LETTER_SPACING,
    threshold = 128,
  }: { typeface: SkTypeface; size?: number; letterSpacing?: number; threshold?: number },
): RenderedLabel | null => {
  const font = Skia.Font(typeface, REFERENCE_FONT_SIZE);
  const glyphs = font.getGlyphIDs(text);
  const advances = font.getGlyphWidths(glyphs);
  const spacing = letterSpacing * REFERENCE_FONT_SIZE;
  // ink bounds relative to the origin/baseline, letter spacing added between glyphs
  const bounds = font.measureText(text);
  const inkLeft = bounds.x;
  const inkRight = bounds.x + bounds.width + spacing * Math.max(glyphs.length - 1, 0);
  const height = Math.min(Math.max(size, 1), HEAD_DOTS);
  const scale = bounds.height > 0 ? height / bounds.height : 0;

  const width = Math.max(1, Math.ceil((inkRight - inkLeft) * scale * FEED_STRETCH));
  const surface = Skia.Surface.MakeOffscreen(width, HEAD_DOTS);
  if (!surface) return null;
  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color('white'));
  if (scale > 0) {
    let x = -inkLeft;
    const positions = advances.map((advance) => {
      const position = { x, y: -bounds.y };
      x += advance + spacing;
      return position;
    });
    canvas.translate(0, Math.round((HEAD_DOTS - height) / 2));
    // the printer squeezes columns: pre-stretch along the tape (see `FEED_STRETCH`)
    canvas.scale(scale * FEED_STRETCH, scale);
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('black'));
    canvas.drawGlyphs(glyphs, positions, 0, 0, font, paint);
  }
  surface.flush();

  const imageInfo = {
    width,
    height: HEAD_DOTS,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  };
  const pixels = surface.makeImageSnapshot().readPixels(0, 0, imageInfo);
  if (!(pixels instanceof Uint8Array)) return null;
  // 1-bit threshold: no grey antialiasing left
  for (let i = 0; i < pixels.length; i += 4) {
    const luminance = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    const value = luminance < threshold ? 0 : 255;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }
  const image = Skia.Image.MakeImage(imageInfo, Skia.Data.fromBytes(pixels), width * 4);
  if (!image) return null;
  return {
    width,
    height: HEAD_DOTS,
    data: pixels,
    image,
    lengthMm: dotsToMm(width / FEED_STRETCH),
  };
};

// --- Bluetooth ---

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (base64: string) => Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

/** iOS: creating the manager shows the permission prompt if not answered yet */
export const requestBluetoothPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const permissions =
      Platform.Version >= 31
        ? [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]
        : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    const results = await PermissionsAndroid.requestMultiple(permissions);
    return permissions.every((permission) => results[permission] === 'granted');
  }
  return (await getBluetoothState()) !== State.Unauthorized;
};

// iOS reports `Unknown` until the user answered the permission prompt
const getBluetoothState = () =>
  new Promise<State>((resolve) => {
    const timeout = setTimeout(() => {
      subscription.remove();
      resolve(State.Unknown);
    }, STATE_TIMEOUT_MS);
    const subscription = getManager().onStateChange((newState) => {
      if (newState === State.Unknown || newState === State.Resetting) return;
      clearTimeout(timeout);
      subscription.remove();
      resolve(newState);
    }, true);
  });

/** @returns whether Bluetooth is usable, sets the matching error otherwise */
const ensureBluetooth = async (): Promise<boolean> => {
  if (!(await requestBluetoothPermission())) {
    setError('permission_denied');
    return false;
  }
  const state = await getBluetoothState();
  if (state === State.PoweredOn) return true;
  setError(
    state === State.Unauthorized
      ? 'permission_denied'
      : state === State.PoweredOff
        ? 'bluetooth_off'
        : 'ble',
    new Error(`Bluetooth state: ${state}`),
  );
  return false;
};

const scanPrinters = async (): Promise<ScannedPrinter[]> => {
  const found = new Map<string, ScannedPrinter>();
  let scanError: BleError | null = null;
  useLabelPrinterStore.setState({ isScanning: true });
  try {
    await getManager().startDeviceScan(null, null, (error, device) => {
      if (error) {
        scanError = error;
        return;
      }
      const name = device?.name ?? device?.localName;
      if (device && name && NAME_PREFIXES.some((prefix) => name.startsWith(prefix))) {
        found.set(device.id, { id: device.id, name });
      }
    });
    await new Promise((resolve) => setTimeout(resolve, SCAN_DURATION_MS));
  } finally {
    await getManager().stopDeviceScan();
    useLabelPrinterStore.setState({ isScanning: false });
  }
  if (scanError) throw scanError;
  return [...found.values()];
};

/** The connected device does not expose the LetraTag GATT service. */
class LetraTagNotFoundError extends Error {}

const openPrinter = async ({ id, name }: ScannedPrinter) => {
  const bleManager = getManager();
  // the 500-byte chunks are long writes anyway, a bigger MTU only means fewer packets
  await bleManager.connectToDevice(id, { requestMTU: 512 });
  try {
    await bleManager.discoverAllServicesAndCharacteristicsForDevice(id);
    const service = (await bleManager.servicesForDevice(id)).find(({ uuid }) =>
      uuid.toLowerCase().startsWith(SERVICE_PREFIX),
    );
    if (!service)
      throw new LetraTagNotFoundError(`No GATT service starting with "${SERVICE_PREFIX}"`);
    // `-xxxx-…` after the 8 first hex digits
    const tail = service.uuid.slice(8);
    const txUuid = `be3dd651${tail}`;
    const rxUuid = `be3dd652${tail}`;

    let received = new Uint8Array(0);
    let onReceived: (() => void) | null = null;
    const monitor = bleManager.monitorCharacteristicForDevice(
      id,
      service.uuid,
      rxUuid,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        const bytes = fromBase64(characteristic.value);
        const merged = new Uint8Array(received.length + bytes.length);
        merged.set(received);
        merged.set(bytes, received.length);
        received = merged;
        onReceived?.();
      },
    );

    let connected = true;
    const transport: Transport = {
      get connected() {
        return connected;
      },
      write: async (data) => {
        await bleManager.writeCharacteristicWithResponseForDevice(
          id,
          service.uuid,
          txUuid,
          toBase64(data),
        );
      },
      read: async (length, timeout = 5_000) => {
        const deadline = Date.now() + timeout;
        while (received.length < length) {
          const remaining = deadline - Date.now();
          if (remaining <= 0) throw new Error(`Read timeout (${received.length}/${length} bytes)`);
          await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, remaining);
            onReceived = () => {
              clearTimeout(timer);
              resolve();
            };
          });
          onReceived = null;
        }
        const bytes = received.slice(0, length);
        received = received.slice(length);
        return bytes;
      },
      close: async () => {
        connected = false;
        monitor.remove();
        await bleManager.cancelDeviceConnection(id).catch(() => undefined);
      },
    };

    reset();
    printer = new LetraTagPrinter(PRINTER_DEVICE, transport);
    // the driver only reads the acknowledgement: consume the result too, or the next job would read it
    readPrintResult = async () =>
      parseStatus(await transport.read(STATUS_FRAME_BYTES, PRINT_RESULT_TIMEOUT_MS));
    disconnectSubscription = bleManager.onDeviceDisconnected(id, () => {
      labelPrinterLogger.warn('Printer disconnected');
      connected = false;
      monitor.remove();
      reset();
    });
    useLabelPrinterStore.setState({ deviceName: name, printers: [] });
  } catch (cause) {
    // do not leave a half-open link: the printer would stay unavailable to the next attempt
    await bleManager.cancelDeviceConnection(id).catch(() => undefined);
    throw cause;
  }
};

/**
 * Connect to `target`, or scan and connect when exactly one printer is nearby.
 * When several are found, they are listed in the store for the user to pick one.
 * @returns whether a printer is connected
 */
export const connectLabelPrinter = async (target?: ScannedPrinter): Promise<boolean> => {
  dismissLabelPrinterError();
  if (printer?.connected) return true;
  if (!(await ensureBluetooth())) return false;

  try {
    let selected = target;
    if (!selected) {
      const printers = await scanPrinters();
      labelPrinterLogger.info(`Found ${printers.length} printer(s)`);
      if (printers.length !== 1) {
        useLabelPrinterStore.setState({ printers });
        if (!printers.length) setError('not_found');
        return false;
      }
      [selected] = printers;
    }
    useLabelPrinterStore.setState({ isConnecting: true });
    await openPrinter(selected);
    return true;
  } catch (cause) {
    reset();
    if (cause instanceof LetraTagNotFoundError) setError('not_letratag', cause);
    else if (cause instanceof BleError && cause.errorCode === BleErrorCode.BluetoothUnauthorized)
      setError('permission_denied', cause);
    else if (cause instanceof BleError && cause.errorCode === BleErrorCode.BluetoothPoweredOff)
      setError('bluetooth_off', cause);
    // usually because the printer is linked to another device
    else if (cause instanceof BleError) setError('connection_failed', cause);
    else setError('ble', cause);
    return false;
  } finally {
    useLabelPrinterStore.setState({ isConnecting: false });
  }
};

/** @returns whether the label was printed */
export const printLabel = async (label: RenderedLabel, copies = 1): Promise<boolean> => {
  dismissLabelPrinterError();
  if (!printer?.connected) {
    reset();
    setError('not_connected');
    return false;
  }

  useLabelPrinterStore.setState({ isPrinting: true });
  try {
    // the driver replaces its cached status only when the printer replies at the end of the job
    const previousStatus = await printer.getStatus();
    await printer.print(
      { width: label.width, height: label.height, data: label.data },
      LT_PAPER_WHITE,
      { copies },
    );
    // the driver swallows the status read timeout: do not report a label that was never printed
    if ((await printer.getStatus()) === previousStatus) {
      labelPrinterLogger.warn('No reply from the printer after the print job');
      setError('no_reply');
      return false;
    }

    let result: PrinterStatus;
    try {
      if (!readPrintResult) throw new Error('Printer disconnected');
      result = await readPrintResult();
    } catch (cause) {
      // not every firmware may send it: the acknowledgement is all we know
      labelPrinterLogger.warn('No print result received', cause);
      return true;
    }
    const [fatal] = result.ready ? [] : result.errors;
    if (fatal) {
      setError(fatal.code, new Error(fatal.message));
      return false;
    }
    return true;
  } catch (cause) {
    // the driver throws the status error message, retrieve its code
    const { errors = [] } = (await printer?.getStatus()) ?? {};
    const message = cause instanceof Error ? cause.message : null;
    setError(errors.find((e) => e.message === message)?.code ?? 'ble', cause);
    return false;
  } finally {
    useLabelPrinterStore.setState({ isPrinting: false });
  }
};

/** Release the BLE link: otherwise the printer may refuse the next connection from another device. */
export const disconnectLabelPrinter = async (): Promise<void> => {
  try {
    await printer?.close();
  } catch (cause) {
    labelPrinterLogger.error('disconnect', cause);
  } finally {
    reset();
    useLabelPrinterStore.setState({ printers: [], error: null });
  }
};
