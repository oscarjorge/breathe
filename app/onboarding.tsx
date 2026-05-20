import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useUserData, defaultUserData } from '@/store/UserDataContext';
import { colors, layout, radius, spacing, typography } from '@/theme';

const TOTAL = 3;

export default function Onboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setData } = useUserData();

  const [step, setStep] = useState(1);
  const [cigsPerDay, setCigsPerDay] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');
  const [quitDate, setQuitDate] = useState(new Date());
  const [showAndroidPicker, setShowAndroidPicker] = useState<'date' | 'time' | null>(null);

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowAndroidPicker(null);
      if (event.type === 'dismissed' || !selected) return;
    }
    if (!selected) return;
    const now = new Date();
    setQuitDate(selected > now ? now : selected);
  };

  const openAndroidPicker = (mode: 'date' | 'time') => setShowAndroidPicker(mode);

  const canContinue =
    (step === 1 && parseInt(cigsPerDay, 10) > 0) ||
    (step === 2 && parseFloat(pricePerPack.replace(',', '.')) > 0) ||
    step === 3;

  const next = async () => {
    if (step < TOTAL) {
      setStep(step + 1);
      return;
    }
    await setData({
      ...defaultUserData,
      cigarettesPerDay: parseInt(cigsPerDay, 10),
      pricePerPack: parseFloat(pricePerPack.replace(',', '.')),
      quitDate: quitDate.toISOString(),
    });
    router.replace('/(tabs)');
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>{t('onboarding.step', { current: step, total: TOTAL })}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(step / TOTAL) * 100}%` }]} />
          </View>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.iconBubble}>
          <Ionicons name="leaf-outline" size={32} color={colors.primary} />
        </View>

        {step === 1 && (
          <>
            <Text style={styles.title}>{t('onboarding.cigsPerDay.title')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('onboarding.cigsPerDay.placeholder')}
              placeholderTextColor={colors.outline}
              keyboardType="number-pad"
              value={cigsPerDay}
              onChangeText={setCigsPerDay}
              autoFocus
            />
            <Text style={styles.hint}>{t('onboarding.cigsPerDay.hint')}</Text>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>{t('onboarding.pricePerPack.title')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('onboarding.pricePerPack.placeholder')}
              placeholderTextColor={colors.outline}
              keyboardType="decimal-pad"
              value={pricePerPack}
              onChangeText={setPricePerPack}
              autoFocus
            />
            <Text style={styles.hint}>{t('onboarding.pricePerPack.hint')}</Text>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>{t('onboarding.quitDate.title')}</Text>

            {Platform.OS === 'ios' ? (
              <View style={styles.dateBox}>
                <DateTimePicker
                  value={quitDate}
                  mode="datetime"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={onChangeDate}
                  themeVariant="light"
                  textColor={colors.primary}
                  style={{ alignSelf: 'stretch' }}
                />
              </View>
            ) : (
              <View style={styles.androidDateRow}>
                <Pressable style={styles.androidDateBtn} onPress={() => openAndroidPicker('date')}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={styles.androidDateLabel}>{quitDate.toLocaleDateString()}</Text>
                </Pressable>
                <Pressable style={styles.androidDateBtn} onPress={() => openAndroidPicker('time')}>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                  <Text style={styles.androidDateLabel}>
                    {quitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
                {showAndroidPicker && (
                  <DateTimePicker
                    value={quitDate}
                    mode={showAndroidPicker}
                    maximumDate={new Date()}
                    onChange={onChangeDate}
                  />
                )}
              </View>
            )}

            <Pressable onPress={() => setQuitDate(new Date())} style={styles.nowBtn}>
              <Ionicons name="refresh" size={16} color={colors.primary} />
              <Text style={styles.nowLabel}>{t('onboarding.quitDate.now')}</Text>
            </Pressable>

            <Text style={styles.hint}>{t('onboarding.quitDate.hint')}</Text>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <Pressable onPress={back} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backLabel}>{t('onboarding.back')}</Text>
          </Pressable>
        )}
        <PrimaryButton
          label={step === TOTAL ? t('onboarding.finish') : t('onboarding.next')}
          onPress={next}
          disabled={!canContinue}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  progressWrap: { flex: 1, marginRight: spacing.lg },
  progressLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: radius.full },
  body: {
    paddingHorizontal: layout.containerPadding,
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  input: {
    ...typography.displayHero,
    fontSize: 56,
    lineHeight: 64,
    color: colors.primary,
    textAlign: 'center',
    minWidth: 200,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingVertical: spacing.sm,
  },
  hint: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  dateBox: {
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  androidDateRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  androidDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
  },
  androidDateLabel: { ...typography.bodyLg, color: colors.primary },
  nowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  nowLabel: { ...typography.bodySm, color: colors.primary },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingHorizontal: layout.containerPadding,
    paddingBottom: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backLabel: { ...typography.bodyLg, color: colors.primary, marginLeft: spacing.xs },
});
