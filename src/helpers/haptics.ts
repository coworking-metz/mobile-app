import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export enum HapticFeedbackType {
  Light = 'light',
  Medium = 'medium',
}

export const vibrate = (type: HapticFeedbackType) => {
  switch (type) {
    case HapticFeedbackType.Light:
      if (Platform.OS === 'android') {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      break;
    case HapticFeedbackType.Medium:
      if (Platform.OS === 'android') {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      break;
  }
};
