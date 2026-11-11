import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts } from '@/theme';

const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const displayDate = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
};

const validDate = (value: string): boolean => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
    && date <= new Date()
    && year > 1900;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, updateProfile, logout } = useAuth();
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setBirth(user?.birth ? displayDate(user.birth) : '');
  }, [user]);

  const save = async () => {
    const nextNameError = name.trim().length < 3 ? 'Informe pelo menos 3 caracteres.' : '';
    const nextBirthError = validDate(birth) ? '' : 'Informe uma data válida (DD/MM/AAAA).';
    setNameError(nextNameError);
    setBirthError(nextBirthError);
    if (nextNameError || nextBirthError) return;

    const [day, month, year] = birth.split('/');
    setSaving(true);
    const result = await updateProfile({ name: name.trim(), birth: `${year}-${month}-${day}` });
    setSaving(false);

    if (!result.ok) {
      Alert.alert('Não foi possível salvar', result.error);
      return;
    }
    Alert.alert('Perfil atualizado', 'Seus dados foram salvos.');
  };

  const confirmLogout = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Meu perfil" icon="person-circle" onBack={() => router.back()} />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.message}>Carregando perfil...</Text>
        </View>
      ) : !user ? (
        <View style={styles.guest}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Você está navegando como visitante</Text>
          <Text style={styles.message}>
            Entre ou crie uma conta para consultar seus pedidos em outros aparelhos e manter seus dados de perfil.
          </Text>
          <Button title="Entrar" onPress={() => router.push('/')} style={{ marginTop: 24 }} />
          <Button title="Criar conta" variant="green" onPress={() => router.push('/register')} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.account}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={colors.primary} />
              </View>
              <Text style={styles.accountName}>{user.name}</Text>
              <Text style={styles.accountEmail}>{user.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>Dados pessoais</Text>
            <Input
              label="NOME"
              value={name}
              onChangeText={(value) => { setName(value); setNameError(''); }}
              placeholder="Seu nome"
              autoCapitalize="words"
              error={nameError}
            />
            <Input label="EMAIL" value={user.email} editable={false} />
            <Input
              label="DATA DE NASCIMENTO"
              value={birth}
              onChangeText={(value) => { setBirth(maskDate(value)); setBirthError(''); }}
              placeholder="DD/MM/AAAA"
              keyboardType="number-pad"
              error={birthError}
            />

            <Button
              title={saving ? 'Salvando...' : 'Salvar alterações'}
              variant="green"
              onPress={save}
              disabled={saving}
              style={{ marginTop: 10 }}
            />
            <Button
              title="Sair da conta"
              onPress={confirmLogout}
              disabled={saving}
              style={{ marginTop: 12, backgroundColor: colors.danger }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, paddingBottom: 40 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  guest: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  account: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EAF8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  accountName: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  accountEmail: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 3 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, marginBottom: 14 },
  message: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 8 },
});
