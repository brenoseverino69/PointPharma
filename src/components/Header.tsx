import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme';
import { IconName } from '@/data/types';

export function Logo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.logoIcon}>
        <Ionicons name="medical" size={16} color="#fff" />
      </View>
      <View style={{ marginLeft: 6 }}>
        <Text style={styles.logoText}>
          <Text style={{ color: '#0A2540' }}>Point</Text>
          <Text style={{ color: colors.green }}>Pharma</Text>
        </Text>
      </View>
    </View>
  );
}

interface Props {
  title?: string;
  icon?: IconName;
  onBack?: () => void;
  right?: ReactNode;
}

export default function Header({ title, icon, onBack, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginRight: 10 }}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
        )}
        {icon && <Ionicons name={icon} size={30} color="#fff" style={{ marginRight: 8 }} />}
        {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : <Logo />}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontFamily: fonts.bold, color: '#fff', fontSize: 20, flexShrink: 1 },
  logoIcon: { backgroundColor: colors.green, borderRadius: 8, padding: 5 },
  logoText: { fontFamily: fonts.bold, fontSize: 14 },
});
