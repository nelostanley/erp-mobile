
export default {
  expo: {
    name: "ERP B2B Mobile",
    slug: "erp-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#D32F2F"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#D32F2F"
      },
      package: "com.erpsystem.erpmobile"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    }
  }
};
