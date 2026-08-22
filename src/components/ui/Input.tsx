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
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  isSearch?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
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
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={rest.autoCapitalize ?? 'none'}
          autoCorrect={rest.autoCorrect ?? false}
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
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
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
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  inputContainer: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D9DDE3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  multilineContainer: {
    height: 120,
    borderRadius: 16,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputFocused: {
    borderColor: colors.coral,
    borderWidth: 1.8,
  },
  inputError: {
    borderColor: colors.red,
    borderWidth: 1.8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.primaryText,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.red,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondaryText,
    marginTop: 4,
    marginLeft: 4,
  },
});
