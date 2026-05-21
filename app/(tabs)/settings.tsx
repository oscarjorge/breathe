import { Alert, Linking, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useUserData } from '@/store/UserDataContext';
import { computeStats } from '@/lib/stats';
import { formatMoney, formatInteger } from '@/lib/format';
import { setLanguage } from '@/i18n';
import { colors, layout, radius, spacing, typography } from '@/theme';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { data, update, reset, relapse } = useUserData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  if (!data) return null;

  const stats = computeStats(data);
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  const toggleNotifications = async (value: boolean) => {
    await update({ notifications: { ...data.notifications, enabled: value } });
  };

  const onTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (!selected) return;
    update({ notifications: { ...data.notifications, hour: selected.getHours(), minute: selected.getMinutes() } });
  };

  const notifTime = (() => {
    const d = new Date();
    d.setHours(data.notifications.hour, data.notifications.minute, 0);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  })();

  const handleShare = async () => {
    const msg = i18n.language === 'es'
      ? `🌿 Llevo ${stats.days} días sin fumar y he ahorrado ${formatMoney(stats.moneySaved, data.currency, locale)}. He evitado ${formatInteger(stats.cigarettesAvoided, locale)} cigarrillos. #ElRespiro`
      : `🌿 I've been smoke-free for ${stats.days} days and saved ${formatMoney(stats.moneySaved, data.currency, locale)}. I avoided ${formatInteger(stats.cigarettesAvoided, locale)} cigarettes. #Breathe`;
    await Share.share({ message: msg });
  };

  const confirmRelapse = () => {
    Alert.alert(
      t('settings.relapse'),
      t('settings.relapseConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.relapseConfirmBtn'), style: 'destructive', onPress: () => relapse() },
      ],
    );
  };

  const confirmReset = () => {
    Alert.alert(
      t('settings.resetTitle'),
      t('settings.resetMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.resetBtn'), style: 'destructive', onPress: () => reset() },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>

        {/* GENERAL */}
        <Text style={styles.section}>{t('settings.general')}</Text>
        <View style={styles.group}>
          <Row icon="create-outline" label={t('settings.editData')} onPress={() => setShowEditModal(true)} />
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={styles.rowIcon}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.rowLabel}>{t('settings.notifications')}</Text>
                {data.notifications.enabled && (
                  <Text style={styles.rowSub}>{notifTime}</Text>
                )}
              </View>
            </View>
            <Switch
              value={data.notifications.enabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.outlineVariant, true: colors.secondaryContainer }}
              thumbColor={data.notifications.enabled ? colors.secondary : colors.outline}
            />
          </View>
          {data.notifications.enabled && (
            <Row
              icon="time-outline"
              label={`${t('settings.notifTime')}: ${notifTime}`}
              onPress={() => setShowTimePicker(true)}
            />
          )}
          <Row
            icon="language-outline"
            label={`${t('settings.language')}: ${t('settings.langValue')}`}
            onPress={() => setLanguage(i18n.language === 'es' ? 'en' : 'es')}
          />
        </View>

        {/* APOYO */}
        <Text style={styles.section}>{t('settings.support')}</Text>
        <View style={styles.group}>
          <Row
            icon="alert-circle-outline"
            label={t('settings.relapse')}
            sub={t('settings.relapseHelp')}
            danger
            onPress={confirmRelapse}
          />
        </View>

        {/* MI ACTIVIDAD */}
        <Text style={styles.section}>{t('settings.activity')}</Text>
        <View style={styles.group}>
          <Row icon="time-outline" label={t('settings.history')} onPress={() => setShowHistoryModal(true)} />
          <Row icon="share-outline" label={t('settings.share')} onPress={handleShare} />
        </View>

        {/* LEGAL */}
        <Text style={styles.section}>{t('settings.legal')}</Text>
        <View style={styles.group}>
          <Row icon="shield-outline" label={t('settings.privacy')} onPress={() => Linking.openURL('https://oscarjorge.github.io/breathe/privacy-policy.html')} />
          <Row icon="library-outline" label={t('settings.sources')} onPress={() => setShowSourcesModal(true)} />
        </View>

        {/* DEBUG */}
        <View style={[styles.group, { marginTop: spacing.xxl }]}>
          <Row icon="trash-outline" label={t('settings.resetRow')} danger onPress={confirmReset} />
        </View>

        <Text style={styles.version}>BREATHE v1.0.0 — HECHO CON CONCIENCIA</Text>
      </ScrollView>

      {/* Time picker */}
      {showTimePicker && (
        <DateTimePicker
          value={(() => { const d = new Date(); d.setHours(data.notifications.hour, data.notifications.minute); return d; })()}
          mode="time"
          is24Hour
          onChange={onTimeChange}
        />
      )}

      {/* Edit data modal */}
      <EditDataModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={data}
        onSave={async (cigsPerDay, pricePerPack) => {
          await update({ cigarettesPerDay: cigsPerDay, pricePerPack });
          setShowEditModal(false);
        }}
      />

      {/* History modal */}
      <HistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={data.history}
        locale={locale}
      />

      {/* Sources modal */}
      <SourcesModal
        visible={showSourcesModal}
        onClose={() => setShowSourcesModal(false)}
      />
    </SafeAreaView>
  );
}

// ── Sub-components ──────────────────────────────────────────

function Row({
  icon, label, sub, onPress, danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const labelColor = danger ? colors.error : colors.onSurface;
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]} onPress={onPress}>
      <View style={[styles.rowIcon, danger && { backgroundColor: colors.errorContainer }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: labelColor }]}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.outline} />
    </Pressable>
  );
}

function EditDataModal({
  visible, onClose, data, onSave,
}: {
  visible: boolean;
  onClose: () => void;
  data: { cigarettesPerDay: number; pricePerPack: number };
  onSave: (cigs: number, price: number) => void;
}) {
  const { t } = useTranslation();
  const [cigs, setCigs] = useState(data.cigarettesPerDay.toString());
  const [price, setPrice] = useState(data.pricePerPack.toString());

  const save = () => {
    const c = parseInt(cigs, 10);
    const p = parseFloat(price.replace(',', '.'));
    if (c > 0 && p > 0) onSave(c, p);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('settings.editDataTitle')}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.onSurface} />
          </Pressable>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.fieldLabel}>{t('settings.cigsLabel')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={cigs}
            onChangeText={setCigs}
            keyboardType="number-pad"
            placeholderTextColor={colors.outline}
          />
          <Text style={[styles.fieldLabel, { marginTop: spacing.xl }]}>{t('settings.priceLabel')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.outline}
          />
        </View>
        <View style={styles.modalFooter}>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelLabel}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveLabel}>{t('common.save')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function HistoryModal({
  visible, onClose, history, locale,
}: {
  visible: boolean;
  onClose: () => void;
  history: Array<{ startedAt: string; endedAt: string; durationMs: number; reason?: string }>;
  locale: string;
}) {
  const { t } = useTranslation();

  const formatDuration = (ms: number) => {
    const d = Math.floor(ms / (24 * 3600 * 1000));
    const h = Math.floor((ms % (24 * 3600 * 1000)) / 3600000);
    if (d > 0) return `${d}d ${h}h`;
    return `${h}h`;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('settings.historyTitle')}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.onSurface} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          {history.length === 0 ? (
            <Text style={styles.rowSub}>{t('settings.historyEmpty')}</Text>
          ) : (
            history.map((h, i) => (
              <View key={i} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  {new Date(h.startedAt).toLocaleDateString(locale)} → {new Date(h.endedAt).toLocaleDateString(locale)}
                </Text>
                <Text style={styles.historyDuration}>{formatDuration(h.durationMs)}</Text>
                {h.reason ? <Text style={styles.rowSub}>{h.reason}</Text> : null}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const SOURCES = [
  { label: 'CDC – Benefits of Quitting Smoking', url: 'https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/benefits/index.htm' },
  { label: 'NHS – Benefits of Quitting Smoking', url: 'https://www.nhs.uk/live-well/quit-smoking/benefits-of-quitting-smoking/' },
  { label: 'American Cancer Society – Benefits Over Time', url: 'https://www.cancer.org/cancer/risk-prevention/tobacco/guide-quitting-smoking/benefits-of-quitting-smoking-over-time.html' },
  { label: 'WHO – Tobacco Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/tobacco' },
];

function SourcesModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('settings.sourcesTitle')}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.onSurface} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={[styles.rowSub, { marginBottom: spacing.xl }]}>{t('settings.sourcesDesc')}</Text>
          {SOURCES.map((s) => (
            <Pressable
              key={s.url}
              style={({ pressed }) => [styles.sourceItem, pressed && { opacity: 0.6 }]}
              onPress={() => Linking.openURL(s.url)}
            >
              <Ionicons name="open-outline" size={18} color={colors.primary} style={{ marginRight: spacing.md }} />
              <Text style={[styles.rowLabel, { flex: 1, color: colors.primary }]}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: layout.containerPadding, paddingBottom: 120 },
  title: { ...typography.headlineLgMobile, color: colors.primary, textAlign: 'center' },
  subtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.xxl },
  section: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginTop: spacing.xl, marginBottom: spacing.sm },
  group: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: { ...typography.bodyLg, color: colors.onSurface },
  rowSub: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: 2 },
  version: { ...typography.labelCaps, color: colors.outline, textAlign: 'center', marginTop: spacing.xxxl },
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.containerPadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  modalTitle: { ...typography.titleMd, color: colors.primary },
  modalContent: { padding: layout.containerPadding },
  modalFooter: { flexDirection: 'row', gap: spacing.md, padding: layout.containerPadding },
  fieldLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: spacing.sm },
  fieldInput: {
    ...typography.bodyLg,
    color: colors.onSurface,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.outlineVariant,
    paddingVertical: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  cancelLabel: { ...typography.titleMd, color: colors.onSurface },
  saveBtn: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
  },
  saveLabel: { ...typography.titleMd, color: colors.primary },
  historyItem: {
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  historyDate: { ...typography.bodySm, color: colors.onSurfaceVariant },
  historyDuration: { ...typography.titleMd, color: colors.primary, marginTop: 2 },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
});
