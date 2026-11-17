import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { colors, fonts } from '@/theme';
import api from '@/services/api';
import { mensagemErroAutenticacao } from '@/services/autenticacao';

type Etapa = 'email' | 'codigo';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const solicitarCodigo = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro('Informe um e-mail válido.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      const resposta = await api.post<{ message: string }>('/auth/forgot-password', { email: email.trim() });
      setAviso(resposta.data.message);
      setEtapa('codigo');
    } catch (error) {
      setErro(mensagemErroAutenticacao(error, 'Não foi possível solicitar o código. Tente novamente.'));
    } finally {
      setEnviando(false);
    }
  };

  const redefinirSenha = async () => {
    if (codigo.trim().length < 16) {
      setErro('Confira o código recebido por e-mail.');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(senha)) {
      setErro('A senha deve ter pelo menos 8 caracteres, com letras e números.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não correspondem.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim(),
        codigo: codigo.trim(),
        novaSenha: senha,
      });
      Alert.alert('Senha redefinida', 'Agora você pode entrar com sua nova senha.', [
        { text: 'Ir para o login', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      setErro(mensagemErroAutenticacao(error, 'Não foi possível redefinir a senha. Solicite outro código e tente novamente.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.hero}>
            <View style={styles.icon}>
              <Ionicons name={etapa === 'email' ? 'mail-unread-outline' : 'key-outline'} size={28} color={colors.primary} />
            </View>
            <Text style={styles.eyebrow}>ACESSO À CONTA</Text>
            <Text style={styles.title}>{etapa === 'email' ? 'Recupere sua senha' : 'Digite o código recebido'}</Text>
            <Text style={styles.subtitle}>
              {etapa === 'email'
                ? 'Enviaremos um código de uso único para o e-mail da sua conta.'
                : `Informe o código enviado para ${email.trim()}. Ele expira em 30 minutos.`}
            </Text>
          </View>

          {etapa === 'email' ? (
            <View style={styles.form}>
              <Input
                label="EMAIL DA CONTA"
                value={email}
                onChangeText={(value) => { setEmail(value); setErro(''); }}
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={erro}
              />
              <Button
                title={enviando ? 'Enviando...' : 'Enviar código'}
                variant="green"
                onPress={solicitarCodigo}
                disabled={enviando}
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            <View style={styles.form}>
              {!!aviso && <Text style={styles.notice}>{aviso}</Text>}
              <Input
                label="CÓDIGO DE RECUPERAÇÃO"
                value={codigo}
                onChangeText={(value) => { setCodigo(value); setErro(''); }}
                placeholder="Cole o código do e-mail"
                autoCapitalize="none"
                autoCorrect={false}
                error={erro}
              />
              <Input
                label="NOVA SENHA"
                value={senha}
                onChangeText={(value) => { setSenha(value); setErro(''); }}
                placeholder="Mínimo de 8 caracteres"
                secure
              />
              <Input
                label="CONFIRMAR SENHA"
                value={confirmacao}
                onChangeText={(value) => { setConfirmacao(value); setErro(''); }}
                placeholder="Digite a senha novamente"
                secure
              />
              <Button
                title={enviando ? 'Salvando...' : 'Redefinir senha'}
                variant="green"
                onPress={redefinirSenha}
                disabled={enviando}
                style={{ marginTop: 8 }}
              />
              <TouchableOpacity style={styles.resend} onPress={solicitarCodigo} disabled={enviando}>
                <Text style={styles.resendText}>Solicitar outro código</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/')}>
            <Text style={styles.loginText}>Lembrou a senha? <Text style={styles.loginStrong}>Voltar ao login</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F9FA' },
  container: { flexGrow: 1, padding: 24, paddingBottom: 36 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 7, paddingVertical: 8 },
  backText: { fontFamily: fonts.medium, fontSize: 12, color: colors.primary },
  hero: { alignItems: 'center', marginTop: 34, marginBottom: 28 },
  icon: { width: 70, height: 70, borderRadius: 23, backgroundColor: '#E2F3F4', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.4, color: colors.greenDark },
  title: { fontFamily: fonts.bold, fontSize: 25, color: '#15323A', textAlign: 'center', marginTop: 7 },
  subtitle: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.muted, textAlign: 'center', marginTop: 8, maxWidth: 330 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E3ECEE' },
  notice: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 17, color: colors.greenDark, backgroundColor: '#EDF8F2', padding: 11, borderRadius: 12, marginBottom: 15 },
  resend: { alignItems: 'center', marginTop: 15, padding: 5 },
  resendText: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },
  loginLink: { alignItems: 'center', paddingVertical: 20 },
  loginText: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  loginStrong: { fontFamily: fonts.bold, color: colors.primary },
});
