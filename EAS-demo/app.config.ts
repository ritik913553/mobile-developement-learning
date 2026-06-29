import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) return "com.ritikgupta9135.EASdemo.dev";
  if (IS_PREVIEW) return "com.ritikgupta9135.EASdemo.preview";
  return "com.ritikgupta9135.EASdemo"; 
};

const getAppName = () => {
  if (IS_DEV) return "EAS-demo (Dev)";
  if (IS_PREVIEW) return "EAS-demo (Preview)";
  return "EAS-demo";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "EAS-demo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "easdemo",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    icon: "./assets/expo.icon",
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: getUniqueIdentifier(),
  },
  web: {
    ...config.web,
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...config.extra,
    router: {},
    eas: {
      projectId: "e1a6e184-fe60-458e-be09-18bd5f4fca5a",
    },
  },
});
