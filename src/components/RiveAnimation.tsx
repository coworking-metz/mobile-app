// ─────────────────────────────────────────────────────────────────────────────
// Why do we translate the output of `require()` / Image.resolveAssetSource?
//
// • React Native gives **different URI formats** in dev vs. release and on
//   iOS vs. Android:
//
//     dev (Metro)            → http://<LAN-IP>:8081/assets/swipe_up.riv
//     iOS release bundle     → file:///…/MyApp.app/…/swipe_up.riv
//     Android release bundle → asset:/swipe_up.riv
//
// • The native side of rive-react-native accepts **exactly one** of two props:
//       – `url`          → for true network / downloaded files
//       – `resourceName` → for assets already inside the app bundle
//
//   Passing *both* (or the wrong one) makes the animation fail silently.
//
// This helper normalizes every RN-style URI into the one prop that Rive
// expects on the current platform & build type.
// ─────────────────────────────────────────────────────────────────────────────
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Image, Platform } from 'react-native';
import Rive, { type RiveRef } from 'rive-react-native';
import type React from 'react';

export type RiveSourceResult =
  | { url: string; resourceName?: never }
  | { resourceName: string; url?: never };

export function getRiveSource(source: never): RiveSourceResult {
  const { uri } = Image.resolveAssetSource(source);

  // 1. Remote file (http/https) → url
  if (/^https?:\/\//.test(uri)) {
    return { url: uri };
  }

  // 2. iOS – file inside the .app bundle → resourceName = bare filename
  if (/^file:\/\//.test(uri) && Platform.OS === 'ios') {
    const match = uri.match(/.*\.app\/(.*)\.riv$/);
    if (match) return { resourceName: match[1] }; // “swipe_up”
    // EAS/OTA downloaded file – treat as network asset
    return { url: uri };
  }

  // 3. Android release or raw-resource name → resourceName
  return { resourceName: uri };
}

type WrapperProps = Omit<React.ComponentProps<typeof Rive>, 'url' | 'resourceName'> & {
  source: never;
};

const RiveAnimation: ForwardRefRenderFunction<RiveRef, WrapperProps> = (
  { source, ...rest },
  ref,
) => {
  const riveSource = getRiveSource(source); // { url } *or* { resourceName }

  return (
    <Rive
      ref={ref}
      {...rest}
      {...riveSource}
      onError={(err) => {
        console.error(`${err.type}: ${err.message}`);
      }}
    />
  );
};

export default forwardRef(RiveAnimation);
