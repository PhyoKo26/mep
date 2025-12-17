import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import {
    bgInput,
    borderColor,
    errorBorderColor,
    placeholderColor,
} from 'styles/colors';
import { cn } from 'utils/helpers';
// import { ChevronDownIcon } from 'assets/svg';
import { ChevronDownIcon } from 'lucide-react-native';

interface FormSelectProps {
    name: string;
    label?: string;
    className?: string;
    placeholder?: string;
    rules?: object;
    options: string[]; // Array of options passed from parent
    type?: 'default' | 'login';
    isDisabled?: boolean;
    onChangeProp?: (value: string) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
    name,
    label,
    placeholder = 'Select an option',
    rules,
    className,
    options,
    type = 'default',
    isDisabled,
    onChangeProp
}) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const error = errors[name];
    const [open, setOpen] = useState(false);

    return (
        <View className={cn('gap-2', className)}>
            {label && (
                <AppText className={cn(type === 'login' ? 'text-black' : 'text-gray-500', 'min-h-7')}>
                    {label}
                </AppText>
            )}

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TouchableOpacity
                            className={cn(
                                'px-3 rounded-lg leading-5 text-left border justify-center',
                                type === 'login' ? bgInput : 'bg-white',
                                error ? errorBorderColor : borderColor,
                                'min-h-14'
                            )}
                            onPress={() => setOpen(true)}
                            disabled={isDisabled}
                        >
                            <View className="flex-row items-center justify-between">
                                <AppText className={value ? 'text-black' : placeholderColor}>
                                    {value || placeholder}
                                </AppText>
                                {!isDisabled && <ChevronDownIcon width={20} height={20} color="#02107D" />}
                            </View>
                        </TouchableOpacity>

                        {/* Modal for options */}
                        <Modal
                            visible={open}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setOpen(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPressOut={() => setOpen(false)}
                            >
                                <View style={styles.modalContent}>
                                    <FlatList
                                        data={options}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.optionItem}
                                                onPress={() => {
                                                    onChange(item);
                                                    if (onChangeProp) {
                                                        onChangeProp(item);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                <AppText style={item === value ? styles.selectedText : undefined}>
                                                    {item}
                                                </AppText>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </>
                )}
            />

            {error && <ErrorText text={error.message as string} />}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: 300,
        paddingVertical: 10,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    selectedText: {
        fontWeight: 'bold',
        color: '#02107D', // example primary blue color
    },
});

export default FormSelect;
