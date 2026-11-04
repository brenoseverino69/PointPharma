import React, { useEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fonts } from '@/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace('/home');
  }, [authLoading, router, user]);

  const submit = async () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.email = 'Informe um e-mail válido';
    if (!password) nextErrors.password = 'Informe sua senha';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Não foi possível entrar', result.error);
      return;
    }
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 50 }}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.sub}>Entre para continuar</Text>
          </View>

          <Input label="EMAIL" value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="SENHA" value={password} onChangeText={setPassword} placeholder="Sua senha" secure error={errors.password} />

          <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade em breve.')}>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: 80 }} />

          <Button title={submitting ? 'Entrando...' : 'Entrar'} onPress={submit} disabled={submitting || authLoading} />
          <TouchableOpacity style={{ marginTop: 18 }} onPress={() => router.push('/register')}>
            <Text style={[styles.link, { textAlign: 'center' }]}>Cadastre-se</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 18 }} onPress={() => router.replace('/home')}>
            <Text style={[styles.link, { textAlign: 'center' }]}>Continuar como visitante</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  container: { flexGrow: 1, padding: 28, paddingBottom: 40 },
  title: { fontFamily: fonts.bold, fontSize: 40, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: '#000', marginTop: 2 },
  link: { fontFamily: fonts.regular, fontSize: 12, color: '#000', textDecorationLine: 'underline' },
});
