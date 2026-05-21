import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor build configuration for the mobile (Android) APK.
// The mobile experience is intentionally a focused subset of the web app
// surfaced via the bottom navigation (Home, Feed, Praise, People, Events).
const config: CapacitorConfig = {
  appId: "com.corpconnect.app",
  appName: "CorpConnect",
  webDir: "dist",
  // Lets the splash + status bar feel native to the brand color.
  backgroundColor: "#4f46e5",
  android: {
    backgroundColor: "#4f46e5",
    allowMixedContent: false,
  },
};

export default config;
