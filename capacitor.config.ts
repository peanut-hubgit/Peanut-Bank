import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.peanutbank.app',
  appName: 'Peanut Bank',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#140b06',
  },
};

export default config;
