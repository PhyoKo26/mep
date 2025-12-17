import { AppRouteParams, AppStackParamList, RootStackParamList } from 'navigation/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type UseAppNavigationProps = StackNavigationProp<AppRouteParams>;

const useAppNavigate = () => {
  const navigation = useNavigation<UseAppNavigationProps>();

  return {
    appNavigation: navigation,
  };
};

export default useAppNavigate;
