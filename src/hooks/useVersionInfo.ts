import DeviceInfo from 'react-native-device-info';

const useVersionInfo = () => {
  const getVersionNumber = () => {
    return DeviceInfo.getVersion();
  };

  return {
    getVersionNumber,
  };
};

export default useVersionInfo;
