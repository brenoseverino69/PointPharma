import React, { useEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="medical" size={21} color="#fff" />
            </View>
            <Text style={styles.brandName}>
              Point<Text style={{ color: colors.green }}>Pharma</Text>
            </Text>
            <View style={styles.trustMark}>
              <Ionicons name="heart" size={13} color={colors.greenDark} />
              <Text style={styles.trustText}>Cuidado perto</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>SAÚDE DO SEU JEITO</Text>
              <Text style={styles.heroTitle}>Seu cuidado,{ '\n' }mais perto.</Text>
              <Text style={styles.heroSub}>Encontre farmácias e produtos para o seu dia a dia.</Text>
            </View>
            <View style={styles.heroArt}>
              <View style={styles.heroCircle}>
                <Ionicons name="medkit" size={42} color={colors.primary} />
              </View>
              <View style={styles.heroSparkle}><Ionicons name="add" size={17} color="#fff" /></View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Boas-vindas!</Text>
            <Text style={styles.formSub}>Entre na sua conta para continuar.</Text>

            <View style={styles.fields}>
              <Input label="EMAIL" value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} bg="#F4F8F9" />
              <Input label="SENHA" value={password} onChangeText={setPassword} placeholder="Sua senha" secure error={errors.password} bg="#F4F8F9" />
            </View>

            <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade em breve.')} style={styles.forgot}>
              <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button title={submitting ? 'Entrando...' : 'Entrar'} variant="green" onPress={submit} disabled={submitting || authLoading} style={styles.loginButton} />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.guestButton} onPress={() => router.replace('/home')} activeOpacity={0.85}>
            <Ionicons name="storefront-outline" size={18} color={colors.primary} />
            <Text style={styles.guestText}>Continuar como visitante</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.privacyLink} onPress={() => router.push('/privacy')}>
            <Ionicons name="shield-checkmark-outline" size={15} color={colors.muted} />
            <Text style={styles.privacyText}>Política de privacidade</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F9FA' },
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 28 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontFamily: fonts.bold, fontSize: 19, color: '#15323A', marginLeft: 9 },
  trustMark: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E6F6EF', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 20, marginLeft: 'auto' },
  trustText: { fontFamily: fonts.medium, fontSize: 9, color: colors.greenDark },
  hero: { minHeight: 174, borderRadius: 24, padding: 20, backgroundColor: '#DDF3F4', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', marginBottom: 20 },
  heroCopy: { flex: 1, zIndex: 1 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.4, color: colors.greenDark, marginBottom: 8 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 31, color: '#12313A' },
  heroSub: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 17, color: '#507079', marginTop: 8, maxWidth: 205 },
  heroArt: { width: 92, height: 118, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  heroCircle: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#1B6573', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  heroSparkle: { position: 'absolute', right: 0, top: 7, width: 27, height: 27, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  formCard: { backgroundColor: '#fff', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E8EFF0', shadowColor: '#15323A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 18, elevation: 3 },
  formTitle: { fontFamily: fonts.bold, fontSize: 21, color: '#15323A' },
  formSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 3, marginBottom: 19 },
  fields: { gap: 1 },
  forgot: { alignSelf: 'flex-end', marginTop: -2, marginBottom: 14 },
  link: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },
  loginButton: { borderRadius: 14 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 17 },
  registerText: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  registerLink: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary },
  guestButton: { minHeight: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DCEAEC', borderRadius: 14, marginTop: 13, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  guestText: { flex: 1, textAlign: 'center', fontFamily: fonts.semi, fontSize: 12, color: '#31535B' },
  privacyLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 18, padding: 4 },
  privacyText: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
});
