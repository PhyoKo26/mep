import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const usePreventGoBack = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const preventHandler = (e: any) => {
      e.preventDefault();
    };

    navigation.addListener('beforeRemove', preventHandler);

    return () => {
      navigation.removeListener('beforeRemove', preventHandler);
    };
  }, [navigation]);
};

export default usePreventGoBack;
