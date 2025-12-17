import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';
import { AppRouteParams } from './types';

// Create a navigation reference
export const navigationRef = createNavigationContainerRef<AppRouteParams>();

export const NavigationService = {
  /**
   * Navigate to a specific screen.
   * @param name - Screen name to navigate to.
   * @param params - Optional parameters for the screen.
   */
  navigate<RouteName extends keyof AppRouteParams>(name: RouteName, params?: AppRouteParams[RouteName]) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as any, params);
    } else {
      console.warn('Navigation service is not ready.');
    }
  },

  /**
   * Go back to the previous screen.
   */
  goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    } else {
      console.warn('Cannot go back. Navigation stack is empty or not ready.');
    }
  },

  /**
   * Replace the current screen with a new one.
   * @param name - Screen name to replace with.
   * @param params - Optional parameters for the screen.
   */
  replace<RouteName extends keyof AppRouteParams>(name: RouteName, params?: AppRouteParams[RouteName]) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.replace(name, params));
    } else {
      console.warn('Navigation service is not ready.');
    }
  },

  /**
   * Reset the navigation state and navigate to a new route.
   * @param name - Screen name to reset to.
   * @param params - Optional parameters for the screen.
   */
  reset<RouteName extends keyof AppRouteParams>(name: RouteName, params?: AppRouteParams[RouteName]) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name, params }],
        })
      );
    } else {
      console.warn('Navigation service is not ready.');
    }
  },

  /**
   * Pop a specific number of screens from the stack.
   * @param count - Number of screens to pop.
   */
  pop(count: number = 1) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(count));
    } else {
      console.warn('Navigation service is not ready.');
    }
  },

  /**
   * Pop to the top of the stack.
   */
  popToTop() {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop());
    } else {
      console.warn('Navigation service is not ready.');
    }
  },
};
