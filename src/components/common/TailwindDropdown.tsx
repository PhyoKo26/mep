import AppText from 'components/text/AppText';
import { ChevronDownIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { cn } from 'utils/helpers';

type Option = {
    id: any;
    label: string;
    value: string;
    icon?: string;
    desc?: string;
};

type Props = {
    options: Option[];
    selectedValue: any | null;
    onSelect: (id: any) => void;
};

export default function TailwindDropdown({ options, selectedValue, onSelect }: Props) {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options?.find(opt => opt.id === selectedValue);
    const selectedLabel = selectedOption ? (selectedOption.label ?? selectedOption.desc) : 'Select an option';

    return (
        <View className="relative">
            <TouchableOpacity
                className={cn(
                    'px-3 rounded-lg leading-5 text-left border border-gray-400 justify-center bg-white',
                    'min-h-14'
                )}
                onPress={() => setModalVisible(true)}
            >
                <View className="flex-row items-center justify-between">
                    <AppText className={selectedLabel ? 'text-black' : 'text-gray'}>
                        {selectedLabel}
                    </AppText>
                    <ChevronDownIcon width={20} height={20} color="#02107D" />
                </View>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/80 justify-center px-4"
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View className="bg-white rounded-md max-h-64">
                        <FlatList
                            keyboardShouldPersistTaps="handled"
                            data={options}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-200"
                                    onPress={() => {
                                        onSelect(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-lg text-gray-900">{item.label || item.desc}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
