import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUserData } from '@/store/UserDataContext';
import { computeStats } from '@/lib/stats';
import { formatInteger, formatMoney } from '@/lib/format';
import { TimeCounter } from '@/components/TimeCounter';
import { StatCard } from '@/components/StatCard';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, layout, radius, spacing, typography } from '@/theme';

const QUOTE = '"Cada respiración es una nueva oportunidad"';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { data } = useUserData();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!data) return null;

  const stats = computeStats(data, now);
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  // simple health progress: cap at 1 year for the bar
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  const healthProgress = Math.min(1, stats.msElapsed / yearMs);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>{t('home.greeting')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TimeCounter stats={stats} />

        <StatCard
          label={t('home.moneySaved')}
          value={formatMoney(stats.moneySaved, data.currency, locale)}
          caption="Suficiente para una cena especial"
          icon="wallet-outline"
          style={{ marginTop: spacing.lg }}
        />

        <StatCard
          label={t('home.cigarettesAvoided')}
          value={formatInteger(stats.cigarettesAvoided, locale)}
          caption={t('home.savedYourLungs')}
          icon="leaf-outline"
          style={{ marginTop: spacing.lg }}
        />

        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthTitle}>{t('home.healthRecovery')}</Text>
            <Text style={styles.healthPct}>{Math.round(healthProgress * 100)}%</Text>
          </View>
          <ProgressBar progress={healthProgress} />
          <Text style={styles.healthCaption}>Tus niveles de oxígeno han vuelto a la normalidad.</Text>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{QUOTE}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  brand: { ...typography.titleMd, color: colors.primary },
  content: {
    paddingHorizontal: layout.containerPadding,
    paddingBottom: 120,
  },
  healthCard: {
    marginTop: spacing.xxl,
    padding: spacing.xl,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  healthTitle: { ...typography.titleMd, color: colors.primary },
  healthPct: { ...typography.titleMd, color: colors.primary },
  healthCaption: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: spacing.md, fontStyle: 'italic' },
  quoteCard: {
    marginTop: spacing.xxl,
    padding: spacing.xxl,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  quoteText: {
    ...typography.titleMd,
    color: colors.onPrimary,
    textAlign: 'center',
  },
});
