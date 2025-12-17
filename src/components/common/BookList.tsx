import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import { AppText } from 'components';
import { Book } from 'features/book/types';

const { width: WIDTH } = Dimensions.get('window');
const CARD_WIDTH = WIDTH / 2.8;

type BookListProps = {
    title: string;
    books: Book[];
    onSeeAllPress?: () => void;
    onBookPress?: (book: Book) => void;
};

const BookList = ({
    title,
    books,
    onSeeAllPress,
    onBookPress
}: BookListProps) => {
    const { appNavigation } = useAppNavigate();

    const renderBookCard = ({ item, index }: { item: Book; index: number }) => (
        <TouchableOpacity
            className={`${index === books.length - 1 ? '' : 'mr-4'}`}
            onPress={() => onBookPress?.(item)}
            style={{ width: CARD_WIDTH }}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.4 }}
                className="rounded-lg mb-2"
                resizeMode="cover"
            />
            <AppText language='mm' weight='semibold' className="text-sm line-clamp-1">
                {item.title}
            </AppText>
            <AppText className="text-xs mb-1">{item.author}</AppText>
            <AppText weight='semibold' className="text-xs text-gray-600">
                {item.price} Ks
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
                data={books}
                renderItem={renderBookCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingRight: 20 }}
            />
        </View>
    );
};

export default memo(BookList);
