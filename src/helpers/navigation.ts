import { StackActions } from '@react-navigation/native';
import { router, useNavigationContainerRef } from 'expo-router';

export default function useResetNavigation() {
  const navigation = useNavigationContainerRef();

  return (route: string) => {
    navigation.dispatch(StackActions.popToTop());
    router.replace(route);
  };
}
