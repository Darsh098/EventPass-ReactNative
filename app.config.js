module.exports = {
  name: "EventPass",
  scheme: "event-pass",
  version: "1.0.0",
  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: "a1f863f6-77a1-4f31-a2ff-2456f84f6edb",
    },
  },
  icon: "./assets/icon-2.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  android: {
    package: "com.example.eventpass",
  },
  updates: {
    url: "https://u.expo.dev/a1f863f6-77a1-4f31-a2ff-2456f84f6edb",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};
