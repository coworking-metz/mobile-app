// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: process.env.APP_SLUG || 'coworking-mobile',
  name: process.env.APP_NAME || 'Le Poulailler',
  icon: process.env.APP_ICON || './src/assets/images/icon.png',
  android: {
    ...config.android,
    adaptiveIcon: {
      ...config.android?.adaptiveIcon,
      foregroundImage: process.env.APP_ADAPTIVE_ICON || './src/assets/images/adaptive-icon-dev.png',
    },
  },
  extra: {
    ...config.extra,
    buildDate: new Date().toISOString(), // https://stackoverflow.com/a/65970202
  },
});
