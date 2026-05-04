import { MaterialCommunityIconsName } from '@/components/AppIcon';

export enum CommutingMode {
  ON_FOOT = 'ON_FOOT',
  CYCLING = 'CYCLING',
  DRIVING = 'DRIVING',
}

export const COMMUTING_MODES = Object.keys(CommutingMode) as CommutingMode[];

export const getCommuteModeIcon = (type: CommutingMode): MaterialCommunityIconsName => {
  switch (type) {
    case CommutingMode.ON_FOOT:
      return 'walk';
    case CommutingMode.CYCLING:
      return 'bicycle';
    case CommutingMode.DRIVING:
      return 'car';
  }
};
