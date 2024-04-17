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
  plugins: [
    'expo-localization',
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 21,
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
          kotlinVersion: '1.8.10',
        },
        ios: {
          deploymentTarget: '14.0',
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-custom-assets',
      {
        // Add asset directory paths, the plugin copies the files in the given paths to the app bundle folder named Assets
        assetsPaths: ['./src/assets/rive'],
      },
    ],
  ],
});
