import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'dark' | 'green' | 'cyan';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'dark', style, disabled }: Props) {
  const bg = { dark: colors.dark, green: colors.green, cyan: colors.cyan }[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { color: '#fff', fontFamily: fonts.bold, fontSize: 14, textAlign: 'center' },
});
