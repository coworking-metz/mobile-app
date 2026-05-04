import { includes } from 'lodash';
import { MaterialCommunityIconsName } from '@/components/AppIcon';
import { DeviceType } from '@/services/api/members';

// https://stackoverflow.com/a/12010778
const MAC_ADDRESS_REGEX = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
export const MAC_ADDRESS_LENGTH = 17;

export const isValidMacAddress = (macAddress?: string): boolean => {
  return !!macAddress && MAC_ADDRESS_REGEX.test(macAddress);
};

/**
 * Checks if the given MAC address is a locally administered address
 * meaning it is virtual.
 *
 * @see https://www.blackmanticore.com/fc5c95c7c2e29e262ec89c539852f8fb
 * @see https://github.com/coworking-metz/Portail-Coworking-Metz/blob/master/wp-content/mu-plugins/plugins/devices/devices.inc.php#L100
 * @param macAddress
 * @returns boolean
 */
export const isLocallyAdministeredMacAddress = (macAddress: string): boolean => {
  const [_firstChar, secondChar] = macAddress
    ?.trim()
    .toUpperCase()
    .replace(/[^\d|A-Z]/g, '')
    .split('');

  if (secondChar) {
    const randomizedChars = ['2', '6', 'A', 'E'];
    return includes(randomizedChars, secondChar);
  }
  return false;

  // const macAddressParts = macAddress.split(':');
  // return (
  //   macAddressParts.length === 6 &&
  //   parseInt(macAddressParts[0], 16) % 2 === 0 &&
  //   parseInt(macAddressParts[1], 16) % 2 === 1
  // );
};

export const formatMacAddress = (macAddress: string): string => {
  return (
    macAddress
      .trim()
      .toUpperCase()
      .replace(/[^\d|A-Z]/g, '')
      .match(/.{1,2}/g) || []
  ).join(':');
};

export const getDeviceTypeIcon = (type: DeviceType): MaterialCommunityIconsName => {
  switch (type) {
    case DeviceType.COMPUTER:
      return 'laptop';
    case DeviceType.MOBILE:
      return 'cellphone';
    case DeviceType.WEARABLE:
      return 'watch';
    default:
      return 'cellphone-link';
  }
};
