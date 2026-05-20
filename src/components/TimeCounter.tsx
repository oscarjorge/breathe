import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing, typography } from '@/theme';
import { LiveStats } from '@/lib/stats';
import { pad2 } from '@/lib/format';

type Props = { stats: LiveStats };

export function TimeCounter({ stats }: Props) {
  const { t } = useTranslation();

  const items: Array<{ value: string; label: string }> = [
    { value: pad2(stats.days), label: t('home.days') },
    { value: pad2(stats.hours), label: t('home.hours') },
    { value: pad2(stats.minutes), label: t('home.minutes') },
    { value: pad2(stats.seconds), label: t('home.seconds') },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{t('home.timeWithoutSmoking')}</Text>
        <Ionicons name="time-outline" size={20} color={colors.inverseOnSurface} />
      </View>

      <View style={styles.grid}>
        {items.map((it) => (
          <View key={it.label} style={styles.cell}>
            <Text style={styles.value}>{it.value}</Text>
            <Text style={styles.cellLabel}>{it.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.encouragement}>
        <View style={styles.dot} />
        <Text style={styles.encouragementText}>{t('home.encouragement')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLabel: {
    ...typography.labelCaps,
    color: colors.inverseOnSurface,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    ...typography.displayHero,
    fontSize: 40,
    lineHeight: 48,
    color: colors.onPrimary,
  },
  cellLabel: {
    ...typography.labelCaps,
    color: colors.onPrimaryContainer,
    marginTop: 2,
  },
  encouragement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
    marginRight: spacing.sm,
  },
  encouragementText: {
    ...typography.bodySm,
    color: colors.inverseOnSurface,
  },
});
