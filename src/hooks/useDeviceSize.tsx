import { useWindowDimensions } from 'react-native';

// Define standard breakpoints
const DEVICE_SIZES = {
  SMALL: 375, // Small phones (including iPhone SE)
  MEDIUM: 768, // Medium devices (regular iPhones, tablets)
  LARGE: 1024, // Large devices (iPads, big tablets)
};

const useDeviceSize = () => {
  const { width } = useWindowDimensions();

  if (width <= DEVICE_SIZES.SMALL) return 'small';
  if (width < DEVICE_SIZES.MEDIUM) return 'medium';
  return 'large';
};

export default useDeviceSize;
