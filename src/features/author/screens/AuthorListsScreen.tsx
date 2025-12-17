import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { Author } from '../types';
import authorData from 'features/home/data/authorData';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const AuthorListsScreen = () => {
  const { appNavigation } = useAppNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // const renderAuthorCard = ({ item, index }: { item: Author; index: number }) => (
  //   <TouchableOpacity
  //     className={`mb-4`}
  //     onPress={() => console.log(item)}
  //     style={{ width: '30%' }}
  //   >
  //     <Image
  //       source={{ uri: item.image }}
  //       className="w-full h-44 rounded-3xl mb-2"
  //       resizeMode="cover"
  //     />
  //     <AppText language='mm' className="text-sm line-clamp-1">
  //       {item.name}
  //     </AppText>
  //   </TouchableOpacity>
  // );
  const renderAuthorCard = ({ item, index }: { item: Author; index: number }) => (
    <TouchableOpacity
      className="mb-4"
      onPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: item.name } })}
      style={{
        width: '30%',
        left: index % 3 === 0 ? 0 : index % 3 === 1 ? '5%' : '10%',
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-44 rounded-3xl mb-2"
        resizeMode="cover"
      />
      <AppText language='mm' className="text-sm line-clamp-1">
        {item.name}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      header={<Header title={"Author"} showBackButton={false} />}
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="pt-4 px-6">
          <FlatList
            data={authorData as any}
            numColumns={3}
            renderItem={renderAuthorCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            // columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>
      }
    </ScreenWrapper>
  );
};

export default AuthorListsScreen;
