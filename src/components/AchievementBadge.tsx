import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  icon: string;
  label: string;
  unlocked: boolean;
  onPress: () => void;
};

export function AchievementBadge({ icon, label, unlocked, onPress }: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.circle, unlocked ? styles.circleUnlocked : styles.circleLocked]}>
        <Text style={[styles.icon, !unlocked && styles.iconLocked]}>{icon}</Text>
      </View>
      <Text
        style={[styles.label, !unlocked && styles.labelLocked]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '30%',
    marginBottom: spacing.xl,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  circleUnlocked: {
    backgroundColor: colors.secondaryContainer,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  circleLocked: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
  },
  icon: { fontSize: 28 },
  iconLocked: { opacity: 0.3 },
  label: {
    ...typography.bodySm,
    color: colors.onSurface,
    textAlign: 'center',
  },
  labelLocked: {
    color: colors.outline,
  },
});
