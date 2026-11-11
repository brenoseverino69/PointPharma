import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { IconName } from '@/data/types';
import { colors, fonts } from '@/theme';

function PolicySection({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Privacidade" icon="shield-checkmark" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark" size={30} color={colors.primary} />
          </View>
          <Text style={styles.eyebrow}>TRANSPARÊNCIA E CUIDADO</Text>
          <Text style={styles.heroTitle}>Sua privacidade importa.</Text>
          <Text style={styles.heroText}>
            Veja quais informações esta versão do PointPharma usa e para que elas servem.
          </Text>
        </View>

        <PolicySection icon="person-outline" title="Dados da conta">
          Ao criar uma conta, o aplicativo usa seu nome, e-mail e data de nascimento para manter seu perfil e associar seus pedidos. Sua senha é tratada pelo serviço de autenticação do aplicativo.
        </PolicySection>

        <PolicySection icon="receipt-outline" title="Pedidos e histórico">
          Para registrar e mostrar um pedido, usamos os produtos escolhidos, quantidades, preços, total, data, forma de pagamento selecionada e situação do pedido. Como visitante, um código do pedido fica salvo neste aparelho para você consultar o histórico.
        </PolicySection>

        <PolicySection icon="card-outline" title="Forma de pagamento">
          O aplicativo registra a opção escolhida no checkout. Nesta versão, ele não processa pagamentos nem solicita dados de cartão.
        </PolicySection>

        <PolicySection icon="server-outline" title="Armazenamento e sessão">
          Os dados de conta e pedidos são enviados à API do PointPharma para permitir as funções do aplicativo. No celular, a sessão da conta é guardada em armazenamento seguro; os códigos de pedidos de visitante ficam no armazenamento local do aparelho.
        </PolicySection>

        <PolicySection icon="options-outline" title="Seu controle">
          Você pode atualizar nome e data de nascimento na tela de perfil, consultar seus pedidos e sair da conta. A LGPD também prevê direitos sobre seus dados, como confirmação de tratamento, acesso e correção.
        </PolicySection>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={20} color="#9A6712" />
          <Text style={styles.noticeText}>
            O PointPharma está em desenvolvimento. Antes de uma publicação externa, esta página precisa incluir a identificação do responsável pelo tratamento e um canal para solicitações sobre dados pessoais.
          </Text>
        </View>

        <Text style={styles.footer}>PointPharma · Informação clara, cuidado responsável</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F9FA' },
  content: { padding: 16, paddingBottom: 30 },
  hero: { backgroundColor: '#E1F3F4', borderRadius: 22, padding: 20, alignItems: 'flex-start', marginBottom: 14 },
  heroIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.3, color: colors.greenDark },
  heroTitle: { fontFamily: fonts.bold, fontSize: 24, color: '#17353D', marginTop: 5 },
  heroText: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: '#58747A', marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E7EFF0' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  sectionIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#EAF6F7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sectionTitle: { fontFamily: fonts.semi, fontSize: 13, color: colors.text, flex: 1 },
  body: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 18, color: '#5D6D70' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#FFF7E7', borderRadius: 14, padding: 14, marginTop: 4 },
  noticeText: { flex: 1, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, color: '#745719' },
  footer: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center', marginTop: 18 },
});
