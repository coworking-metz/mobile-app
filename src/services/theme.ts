import { IS_RUNNING_IN_EXPO_GO } from './environment';

export type AppThemePreference = 'light' | 'dark' | 'system';
export let setAppThemePreference: (theme: AppThemePreference) => void;
export let useAppThemePreference: () => 'light' | 'dark' | 'system';
export let AppThemeBackground: ({}: { dark: string; light?: string }) => React.ReactNode;
if (IS_RUNNING_IN_EXPO_GO) {
  setAppThemePreference = () => null;
  useAppThemePreference = () => 'system';
  AppThemeBackground = () => null; // eslint-disable-line react/display-name
} else {
  setAppThemePreference = require('@vonovak/react-native-theme-control').setThemePreference; // eslint-disable-line @typescript-eslint/no-var-requires
  useAppThemePreference = require('@vonovak/react-native-theme-control').useThemePreference; // eslint-disable-line @typescript-eslint/no-var-requires
  AppThemeBackground = require('@vonovak/react-native-theme-control').AppBackground; // eslint-disable-line @typescript-eslint/no-var-requires
}
