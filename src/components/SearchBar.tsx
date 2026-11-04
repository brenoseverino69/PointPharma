import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '@/theme';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.box}>
      <Ionicons name="search" size={22} color="#000" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#777"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 46, borderRadius: 14, backgroundColor: colors.gray,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8,
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
});
