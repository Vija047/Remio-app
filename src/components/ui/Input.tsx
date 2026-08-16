import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff, Search } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  isSearch?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  isPassword = false,
  isSearch = false,
  containerStyle,
  inputStyle,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          rest.multiline ? styles.multilineContainer : null,
        ]}
      >
        {isSearch && (
          <Search size={18} color={colors.secondaryText} style={styles.leftIcon} />
        )}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            rest.multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholderTextColor={colors.mutedText}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.secondaryText} />
            ) : (
              <Eye size={20} color={colors.secondaryText} />
            )}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  inputContainer: {
    height: 56,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  multilineContainer: {
    height: 120,
    borderRadius: radii['2xl'],
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.red,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.primaryText,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
    marginLeft: 14,
  },
});
