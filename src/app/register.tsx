import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fonts } from '@/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

type Form = { name: string; email: string; password: string; birth: string };

const maskDate = (t: string): string => {
  const d = t.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

const validDate = (s: string): boolean => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  const d = new Date(yyyy, mm - 1, dd);
  return (
    d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd &&
    d <= new Date() && yyyy > 1900
  );
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState<Form>({ name: '', email: '', password: '', birth: '' });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const e: Partial<Form> = {};
    if (form.name.trim().length < 3) e.name = 'Informe seu nome completo';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'E-mail inválido';
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) e.password = 'Mínimo 6 caracteres, com letras e números';
    if (!validDate(form.birth)) e.birth = 'Data inválida (DD/MM/AAAA)';
    setErrors(e);
    if (Object.keys(e).length) return;

    const res = register({ ...form, name: form.name.trim() });
    if (!res.ok) {
      Alert.alert('Erro', res.error);
      return;
    }
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30 }}>
            <Text style={styles.title}>Crie uma nova conta</Text>
            <Text style={styles.sub}>
              Já possui uma conta?{' '}
              <Text style={styles.link} onPress={() => router.replace('/')}>Entre aqui</Text>
            </Text>
          </View>

          <Input bg={colors.gray} label="NOME" value={form.name} onChangeText={set('name')} placeholder="Seu nome" error={errors.name} autoCapitalize="words" />
          <Input bg={colors.gray} label="EMAIL" value={form.email} onChangeText={set('email')} placeholder="voce@email.com" keyboardType="email-address" error={errors.email} />
          <Input bg={colors.gray} label="SENHA" value={form.password} onChangeText={set('password')} placeholder="Crie uma senha" secure error={errors.password} />
          <Input bg={colors.gray} label="DATA DE NASCIMENTO" value={form.birth} onChangeText={(t) => set('birth')(maskDate(t))} placeholder="__/__/____" keyboardType="number-pad" error={errors.birth} />

          <View style={{ height: 30 }} />
          <Button title="Cadastrar" onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, padding: 28, paddingBottom: 40 },
  title: { fontFamily: fonts.bold, fontSize: 30, color: colors.text, textAlign: 'center', lineHeight: 38 },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: '#000', marginTop: 6 },
  link: { color: colors.primary, textDecorationLine: 'underline' },
});
