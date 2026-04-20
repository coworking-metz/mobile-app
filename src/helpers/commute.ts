import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

export enum CommutingMode {
  ON_FOOT = 'ON_FOOT',
  CYCLING = 'CYCLING',
  DRIVING = 'DRIVING',
}

export const COMMUTING_MODES = Object.keys(CommutingMode) as CommutingMode[];

export const getCommuteModeIcon = (type: CommutingMode): keyof typeof mdiGlyphMap => {
  switch (type) {
    case CommutingMode.ON_FOOT:
      return 'walk';
    case CommutingMode.CYCLING:
      return 'bicycle';
    case CommutingMode.DRIVING:
      return 'car';
  }
};
