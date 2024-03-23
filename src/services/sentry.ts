import * as Sentry from '@sentry/react-native';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
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
