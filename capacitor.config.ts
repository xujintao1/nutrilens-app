import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nutrilens.app',
  appName: 'NutriLens 营养管家',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // 开发时可以指向本地服务器
    // url: 'http://10.0.2.2:3000',  // Android 模拟器访问本机
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#8daa9d',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    },
    Camera: {
      permissions: ['camera']
    },
    Preferences: {
      // 使用原生存储，比 localStorage 更安全
    }
  }
};

export default config;
