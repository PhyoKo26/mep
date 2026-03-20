import React, { memo } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PostSkeleton = () => {
  return (
    <View className="gap-3">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={10}>
          <SkeletonPlaceholder.Item width={'100%'} height={150} borderRadius={10} />
          <SkeletonPlaceholder.Item width={'100%'} height={24} />
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
            <SkeletonPlaceholder.Item width={'35%'} height={14} borderRadius={15} />
            <SkeletonPlaceholder.Item width={'15%'} height={14} borderRadius={15} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={10}>
          <SkeletonPlaceholder.Item width={'100%'} height={150} borderRadius={10} />
          <SkeletonPlaceholder.Item width={'100%'} height={24} />
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
            <SkeletonPlaceholder.Item width={'35%'} height={14} borderRadius={15} />
            <SkeletonPlaceholder.Item width={'15%'} height={14} borderRadius={15} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={10}>
          <SkeletonPlaceholder.Item width={'100%'} height={150} borderRadius={10} />
          <SkeletonPlaceholder.Item width={'100%'} height={24} />
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
            <SkeletonPlaceholder.Item width={'35%'} height={14} borderRadius={15} />
            <SkeletonPlaceholder.Item width={'15%'} height={14} borderRadius={15} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default memo(PostSkeleton);
