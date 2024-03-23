import * as Sentry from '@sentry/react-native';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const initSentry = () => {
  Sentry.init({
    dsn:
      process.env.EXPO_PUBLIC_SENTRY_DSN ||
      'https://c9153d09b7ba476985cac82872da4098@o4505571822862336.ingest.sentry.io/4505571856023552',
    enabled: !__DEV__,
    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used as `routingInstrumentation`
        routingInstrumentation,
        // ...
      }),
    ],
  });
};
