// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...(process.env.APP_SLUG && { slug: process.env.APP_SLUG }),
  ...(process.env.APP_NAME && { name: process.env.APP_NAME }),
  ...(process.env.APP_ICON && { icon: process.env.APP_ICON }),
  extra: {
    ...config.extra,
    buildDate: new Date().toISOString(), // https://stackoverflow.com/a/65970202
  },
});
