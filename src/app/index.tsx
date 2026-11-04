import React, { useState } from 'react';
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
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});

  const submit = () => {
    const e: { name?: string; password?: string } = {};
    if (!name.trim()) e.name = 'Informe seu nome';
    if (!password) e.password = 'Informe sua senha';
    setErrors(e);
    if (Object.keys(e).length) return;

    const res = login(name.trim(), password);
    if (!res.ok) {
      Alert.alert('Erro', `${res.error}\nCadastre-se para continuar.`);
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

          <Input label="NOME" value={name} onChangeText={setName} placeholder="Seu nome" error={errors.name} autoCapitalize="words" />
          <Input label="SENHA" value={password} onChangeText={setPassword} placeholder="Sua senha" secure error={errors.password} />

          <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade em breve.')}>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: 80 }} />

          <Button title="Log in" onPress={submit} />
          <TouchableOpacity style={{ marginTop: 18 }} onPress={() => router.push('/register')}>
            <Text style={[styles.link, { textAlign: 'center' }]}>Cadastre-se</Text>
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
