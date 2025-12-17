import { Platform, View, ViewProps } from 'react-native';
import React, { PropsWithChildren, ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from 'utils/helpers';
import LoadingModal from 'components/loading/LoadingModal';
import Loading from 'components/loading/Loading';
import { ScrollView } from 'react-native-gesture-handler';

type ScreenWrapperProps = PropsWithChildren<{}> &
  ViewProps & {
    isSafeArea?: boolean; //
    isScrollable?: boolean; //
    isShowLoading?: boolean; //
    isShowLoadingModal?: boolean;
    needPaddingBottom?: boolean;
    hidePaddingBottom?: boolean;
    header?: ReactNode;
  };

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  className,
  children,
  isSafeArea = false,
  isScrollable = false,
  isShowLoading = false,
  isShowLoadingModal = false,
  needPaddingBottom = false,
  hidePaddingBottom = false,
  header,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('flex-1', className)}
      style={{ paddingBottom: needPaddingBottom ? insets.bottom + (Platform.OS === 'ios' ? 50 : 70) : hidePaddingBottom ? 0 : insets.bottom }}
      {...props}
    >
      {header && header}
      {isScrollable ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          removeClippedSubviews={true}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
      {isShowLoadingModal && <LoadingModal />}
      {isShowLoading && <Loading />}
    </View>
  );
};

export default ScreenWrapper;
