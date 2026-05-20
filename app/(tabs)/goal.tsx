import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '@/store/UserDataContext';
import { computeStats } from '@/lib/stats';
import { formatMoney, formatInteger } from '@/lib/format';
import { GOAL_IMAGES, GoalImageKey } from '@/lib/goalImages';
import { ProgressBar } from '@/components/ProgressBar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, layout, radius, spacing, typography } from '@/theme';

export default function Goal() {
  const { t, i18n } = useTranslation();
  const { data, update } = useUserData();
  const [editing, setEditing] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState<GoalImageKey>('travel_rome');

  if (!data) return null;

  const stats = computeStats(data);
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const goal = data.goal;
  const progress = goal ? Math.min(1, stats.moneySaved / goal.amount) : 0;
  const remaining = goal ? Math.max(0, goal.amount - stats.moneySaved) : 0;

  const openEditor = () => {
    setGoalTitle(goal?.title ?? '');
    setGoalAmount(goal?.amount.toString() ?? '');
    setSelectedImage((goal?.imageKey as GoalImageKey) ?? 'travel_rome');
    setEditing(true);
  };

  const saveGoal = async () => {
    const amount = parseFloat(goalAmount.replace(',', '.'));
    if (!goalTitle.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('', t('common.confirm'));
      return;
    }
    await update({ goal: { title: goalTitle.trim(), amount, imageKey: selectedImage } });
    setEditing(false);
  };

  const img = GOAL_IMAGES.find((g) => g.key === (goal?.imageKey ?? selectedImage));

  if (!goal) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>{t('goal.title')}</Text>
          <Text style={styles.emptyHint}>{t('goal.emptyHint')}</Text>
          <PrimaryButton label={t('goal.create')} onPress={openEditor} style={{ marginTop: spacing.xxl }} />
        </View>
        <GoalEditor
          visible={editing}
          onClose={() => setEditing(false)}
          goalTitle={goalTitle}
          setGoalTitle={setGoalTitle}
          goalAmount={goalAmount}
          setGoalAmount={setGoalAmount}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onSave={saveGoal}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{t('goal.title')}</Text>
        <Text style={styles.goalName}>{goal.title}</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroMeta}>
            <Text style={styles.heroLabel}>{t('goal.heroLabel')}</Text>
            <Text style={styles.heroAmount}>{formatMoney(goal.amount, data.currency, locale)}</Text>
          </View>
          <Text style={styles.heroEmoji}>{img?.emoji ?? '🎯'}</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t('goal.currentSavings')}</Text>
            <Text style={styles.progressValue}>{formatMoney(stats.moneySaved, data.currency, locale)}</Text>
          </View>
          <ProgressBar progress={progress} style={{ marginVertical: spacing.md }} />
          <View style={styles.progressRow}>
            <Text style={styles.progressSub}>{Math.round(progress * 100)}% {t('goal.completed')}</Text>
            <Text style={styles.progressSub}>{t('goal.remaining')} {formatMoney(remaining, data.currency, locale)}</Text>
          </View>
        </View>

        <View style={styles.miniRow}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>{t('goal.daysWithoutSmoking')}</Text>
            <Text style={styles.miniValue}>{formatInteger(stats.days, locale)}</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>{t('goal.cigsAvoided')}</Text>
            <Text style={styles.miniValue}>{formatInteger(stats.cigarettesAvoided, locale)}</Text>
          </View>
        </View>

        <PrimaryButton label={t('goal.edit')} onPress={openEditor} style={{ marginTop: spacing.xxl }} />
      </ScrollView>

      <GoalEditor
        visible={editing}
        onClose={() => setEditing(false)}
        goalTitle={goalTitle}
        setGoalTitle={setGoalTitle}
        goalAmount={goalAmount}
        setGoalAmount={setGoalAmount}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onSave={saveGoal}
      />
    </SafeAreaView>
  );
}

type EditorProps = {
  visible: boolean;
  onClose: () => void;
  goalTitle: string;
  setGoalTitle: (v: string) => void;
  goalAmount: string;
  setGoalAmount: (v: string) => void;
  selectedImage: GoalImageKey;
  setSelectedImage: (v: GoalImageKey) => void;
  onSave: () => void;
};

function GoalEditor({
  visible, onClose, goalTitle, setGoalTitle, goalAmount, setGoalAmount,
  selectedImage, setSelectedImage, onSave,
}: EditorProps) {
  const { t, i18n } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.editorSafe} edges={['top', 'bottom']}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>{t('goal.editorTitle')}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={28} color={colors.onSurface} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.editorContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>{t('goal.rewardQuestion')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('goal.rewardPlaceholder')}
              placeholderTextColor={colors.outline}
              value={goalTitle}
              onChangeText={setGoalTitle}
            />

            <Text style={[styles.fieldLabel, { marginTop: spacing.xl }]}>{t('goal.costQuestion')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="600"
              placeholderTextColor={colors.outline}
              keyboardType="decimal-pad"
              value={goalAmount}
              onChangeText={setGoalAmount}
            />

            <Text style={[styles.fieldLabel, { marginTop: spacing.xl }]}>{t('goal.pickIcon')}</Text>
            <View style={styles.gallery}>
              {GOAL_IMAGES.map((img) => (
                <Pressable
                  key={img.key}
                  onPress={() => setSelectedImage(img.key)}
                  style={({ pressed }) => [
                    styles.galleryItem,
                    selectedImage === img.key && styles.galleryItemSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.galleryEmoji}>{img.emoji}</Text>
                  <Text style={styles.galleryLabel} numberOfLines={1}>
                    {i18n.language === 'es' ? img.labelEs : img.labelEn}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.editorFooter}>
            <PrimaryButton label={t('goal.save')} onPress={onSave} style={{ flex: 1 }} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: layout.containerPadding, paddingBottom: 120 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: layout.containerPadding },
  emptyIcon: { fontSize: 64, marginBottom: spacing.lg },
  emptyTitle: { ...typography.headlineLgMobile, color: colors.primary, textAlign: 'center', marginBottom: spacing.sm },
  emptyHint: { ...typography.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center' },
  eyebrow: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  goalName: { ...typography.headlineLgMobile, color: colors.primary, marginBottom: spacing.xl },
  heroCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  heroMeta: { gap: spacing.xs },
  heroLabel: { ...typography.labelCaps, color: colors.onPrimaryContainer },
  heroAmount: { ...typography.headlineLgMobile, color: colors.onPrimary },
  heroEmoji: { fontSize: 52 },
  progressCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  progressValue: { ...typography.titleMd, color: colors.primary },
  progressSub: { ...typography.bodySm, color: colors.onSurfaceVariant },
  miniRow: { flexDirection: 'row', gap: spacing.md },
  miniCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  miniLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  miniValue: { ...typography.headlineLgMobile, color: colors.primary },
  editorSafe: { flex: 1, backgroundColor: colors.background },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.containerPadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  editorTitle: { ...typography.titleMd, color: colors.primary },
  editorContent: { padding: layout.containerPadding, paddingBottom: spacing.xxl },
  editorFooter: { padding: layout.containerPadding },
  fieldLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: spacing.sm },
  textInput: {
    ...typography.bodyLg,
    color: colors.onSurface,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.outlineVariant,
    paddingVertical: spacing.sm,
  },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  galleryItem: {
    width: '30%',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
  },
  galleryItemSelected: {
    backgroundColor: colors.secondaryContainer,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  galleryEmoji: { fontSize: 28, marginBottom: 4 },
  galleryLabel: { ...typography.bodySm, color: colors.onSurface, textAlign: 'center' },
});
