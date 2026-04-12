import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neubite.app',
  appName: 'neubite',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      // Keyboard overlays the content instead of resizing the WebView.
      // Without this, iOS compresses h-screen when the keyboard opens,
      // pushing the entire layout up and overlapping the status bar.
      resize: 'none',
    },
  },
};

export default config;
