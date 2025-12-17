import { View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import React, { memo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { Search, X } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';

const { width: WIDTH } = Dimensions.get('window');

type SearchComponentProps = {
    onSearch?: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
};

const SearchComponent = ({
    onSearch,
    placeholder = "Search...",
    initialValue = ""
}: SearchComponentProps) => {
    const insets = useSafeAreaInsets();
    const { appNavigation } = useAppNavigate();
    const [searchQuery, setSearchQuery] = useState(initialValue);

    const clearSearch = () => {
        setSearchQuery('');
        onSearch?.('');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    return (
        <View className="w-full">
            <View className="flex-row items-center rounded-full px-3 border">
                <Search size={20} color="#6B7280" className="mr-3" />

                <TextInput
                    className="flex-1 text-base text-gray-900 px-2"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                    returnKeyType="search"
                />

                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} className="p-1">
                        <X size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default memo(SearchComponent);
