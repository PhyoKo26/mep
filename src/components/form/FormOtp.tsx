import React, { memo } from 'react';
import { Dimensions, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import { cn } from 'utils/helpers';
import { OtpInput } from 'react-native-otp-entry';
import { bgInputColorCode, borderColorCode, errorColorCode, primaryColorCode } from 'styles/colors';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
interface FormInputProps {
  name: string;
  label?: string;
  rules?: object;
  className?: string; // Tailwind classes for container
}

const FormInput: React.FC<FormInputProps> = ({ name, label, rules, className = '' }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  const renderOtpInput = ({ field: { onChange, onBlur } }: any) => (
    <OtpInput
      type="numeric"
      focusColor={primaryColorCode}
      numberOfDigits={6}
      onTextChange={onChange}
      onBlur={onBlur}
      theme={{
        pinCodeContainerStyle: {
          borderColor: error ? errorColorCode : '#CCCCCC',
          // backgroundColor: bgInputColorCode,
          borderWidth: 1,
          height: 56,
          width: WIDTH / 9,
          // marginHorizontal: 10
        },
        pinCodeTextStyle: {
          // fontFamily: 'Poppins-Regular',
          fontSize: 16,
          color: '#CCCCCC'
          // lineHeight: 16,
          // backgroundColor: 'red',
        },
        containerStyle: {
          justifyContent: 'center',
          gap: WIDTH / 20,
        },
        focusedPinCodeContainerStyle: {
          borderColor: '#02107D',
          // backgroundColor: bgInputColorCode,
          borderWidth: 1,
          height: 56,
        },
      }}
    />
  );

  return (
    <View className={cn('gap-2', className)}>
      {label && <AppText className="min-h-7 text-white">{label}</AppText>}
      <Controller control={control} name={name} rules={rules} render={renderOtpInput} />
      {error && <ErrorText text={error.message as string} />}
    </View>
  );
};

export default memo(FormInput);
