import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
// import RNSimData from 'react-native-sim-data';
import { Platform } from 'react-native';

// Define the type for device information
interface DeviceInfoState {
  carrier: string | null;
  // mcc: string | null;
  // mnc: string | null;
  deviceName: string | null;
  systemVersion: string | null;
  manufacturer: string | null;
  isEmulator: boolean;
  error: string | null;
  brand: string | null;
  modal: string | null;
  platform: string | null;
  udid: string | null;
  androidVersion: string | null;
  versionCode: string | null;
}

const useDeviceInfo = () => {
  // State with type annotations
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoState>({
    carrier: null,
    deviceName: null,
    systemVersion: null,
    manufacturer: null,
    isEmulator: false,
    error: null,
    brand: null,
    modal: null,
    platform: null,
    udid: null,
    androidVersion: null,
    versionCode: null,
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const carrier = await DeviceInfo.getCarrier();
        const deviceName = await DeviceInfo.getDeviceName();
        const systemVersion = DeviceInfo.getSystemVersion();
        const manufacturer = await DeviceInfo.getManufacturer();
        const isEmulator = await DeviceInfo.isEmulator();
        const brand = DeviceInfo.getBrand();
        const modal = DeviceInfo.getModel();
        const platform = Platform.OS;
        const udid = DeviceInfo.getUniqueIdSync();
        const androidVersion = DeviceInfo.getSystemVersion();
        const versionCode = DeviceInfo.getVersion();

        // const simInfo = RNSimData.getSimInfo();
        // const mcc = simInfo?.mcc0 || null;
        // const mnc = simInfo?.mnc0 || null;

        setDeviceInfo({
          carrier,
          deviceName,
          systemVersion,
          manufacturer,
          isEmulator,
          brand,
          modal,
          platform,
          udid,
          androidVersion,
          versionCode,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching device info:', error);
        setDeviceInfo((prev) => ({
          ...prev,
          error: 'Failed to retrieve device information.',
        }));
      }
    };

    fetchDeviceInfo();
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
