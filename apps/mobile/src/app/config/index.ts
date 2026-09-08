import { Platform } from 'react-native';

const getBaseUrl = () => {
  // If adb reverse tcp:3000 tcp:3000 is run over USB, localhost:3000 works on Android without needing same Wi-Fi
  // 192.168.1.5 is your local Wi-Fi IP address when both laptop & mobile are on the same Wi-Fi
  if (Platform.OS === 'android') {
    return 'http://192.168.1.5:3000';
  }
  return 'http://localhost:3000';
};

export const Config = {
  API_URL: getBaseUrl(),
  ENV: 'development',
  DEFAULT_TIMEOUT: 30000,   // 30s for normal API calls
  UPLOAD_TIMEOUT: 60000,    // 60s for file/image uploads
};

export default Config;
