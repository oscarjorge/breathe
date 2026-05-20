import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: string;
  caption?: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export function StatCard({ label, value, caption, icon, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  value: {
    ...typography.headlineLgMobile,
    color: colors.primary,
  },
  caption: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
});
