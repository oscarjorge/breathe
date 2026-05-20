import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '@/store/UserDataContext';
import { computeStats } from '@/lib/stats';
import { ACHIEVEMENTS, Achievement, AchievementCategory, isUnlocked, unlockedCount } from '@/lib/achievements';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, layout, radius, spacing, typography } from '@/theme';

const CATEGORIES: AchievementCategory[] = ['health', 'streak', 'money', 'cigarettes'];

export default function Achievements() {
  const { t } = useTranslation();
  const { data } = useUserData();
  const [selected, setSelected] = useState<Achievement | null>(null);

  const stats = data ? computeStats(data) : null;
  const ms = stats?.msElapsed ?? 0;
  const money = stats?.moneySaved ?? 0;
  const cigs = stats?.cigarettesAvoided ?? 0;

  const total = ACHIEVEMENTS.length;
  const unlocked = unlockedCount(ms, money, cigs);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('achievements.title')}</Text>
        <Text style={styles.subtitle}>{t('achievements.subtitle')}</Text>

        {/* Progress card */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t('achievements.progressTotal')}</Text>
            <Text style={styles.progressCount}>{unlocked}/{total}</Text>
          </View>
          <ProgressBar progress={unlocked / total} />
        </View>

        {/* Category sections */}
        {CATEGORIES.map((cat) => {
          const items = ACHIEVEMENTS.filter((a) => a.category === cat);
          return (
            <View key={cat} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {cat === 'health' ? '♡ ' : cat === 'streak' ? '◻ ' : cat === 'money' ? '◈ ' : '◉ '}
                {t(`ach.categories.${cat}`)}
              </Text>
              <View style={styles.grid}>
                {items.map((ach) => (
                  <AchievementBadge
                    key={ach.id}
                    icon={ach.icon}
                    label={t(`${ach.labelKey}`)}
                    unlocked={isUnlocked(ach, ms, money, cigs)}
                    onPress={() => setSelected(ach)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Detail modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <View style={styles.sheet}>
            {selected && (
              <>
                <Text style={styles.sheetIcon}>{selected.icon}</Text>
                <Text style={styles.sheetTitle}>{t(selected.labelKey)}</Text>
                <Text style={styles.sheetDesc}>{t(selected.descriptionKey)}</Text>
                {isUnlocked(selected, ms, money, cigs) ? (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                    <Text style={styles.unlockedText}>Desbloqueado</Text>
                  </View>
                ) : (
                  <Text style={styles.lockedText}>Aún no desbloqueado</Text>
                )}
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: layout.containerPadding, paddingBottom: 120 },
  title: { ...typography.headlineLgMobile, color: colors.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant, marginBottom: spacing.xl },
  progressCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  progressLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  progressCount: { ...typography.titleMd, color: colors.primary },
  section: { marginBottom: spacing.xxl },
  sectionTitle: { ...typography.titleMd, color: colors.primary, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
  },
  sheetIcon: { fontSize: 52, marginBottom: spacing.lg },
  sheetTitle: { ...typography.headlineLgMobile, color: colors.primary, textAlign: 'center', marginBottom: spacing.md },
  sheetDesc: { ...typography.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.xl },
  unlockedBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  unlockedText: { ...typography.bodySm, color: colors.secondary },
  lockedText: { ...typography.bodySm, color: colors.outline },
});
