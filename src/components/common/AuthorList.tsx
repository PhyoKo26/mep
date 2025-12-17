import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import { AppText } from 'components';
import { Author } from 'features/author/types';

const { width: WIDTH } = Dimensions.get('window');
const CARD_WIDTH = WIDTH / 2.8;

type AuthorListProps = {
    title: string;
    authors: Author[];
    onSeeAllPress?: () => void;
    onAuthorPress?: (author: Author) => void;
};

const AuthorList = ({
    title,
    authors,
    onSeeAllPress,
    onAuthorPress
}: AuthorListProps) => {
    const { appNavigation } = useAppNavigate();

    const renderAuthorCard = ({ item, index }: { item: Author; index: number }) => (
        <TouchableOpacity
            className={`w-26 ${index === authors.length - 1 ? '' : 'mr-4'}`}
            onPress={() => onAuthorPress?.(item)}
        >
            <Image
                source={{ uri: item.image }}
                className="w-28 h-32 rounded-3xl mb-2"
                resizeMode="cover"
            />
            <AppText language='mm' className="text-xs line-clamp-1">
                {item.name}
            </AppText>
        </TouchableOpacity>
    );

    return (
        <View className="w-full py-2">
            <View className="flex-row justify-between items-center mb-2">
                <AppText weight='bold' className="text-xl text-gray-900">
                    {title}
                </AppText>
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={onSeeAllPress}
                >
                    <AppText className="text-sm text-secondary mt-1">See All</AppText>
                    <ChevronRight size={16} color="#3847BB" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={authors}
                renderItem={renderAuthorCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingRight: 20 }}
            />
        </View>
    );
};

export default memo(AuthorList);
