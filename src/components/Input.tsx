import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  secure?: boolean;
  bg?: string;
}

export default function Input({ label, error, secure, bg = '#fff', ...props }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={{ marginBottom: 14 }}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.box, { backgroundColor: bg }, !!error && styles.err]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#777"
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...props}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)}>
            <Ionicons name={hidden ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1, color: colors.text, marginBottom: 6 },
  box: { height: 48, borderRadius: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  err: { borderWidth: 1.5, borderColor: colors.danger },
  errText: { color: colors.danger, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 },
});
