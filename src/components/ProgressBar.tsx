import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

type Props = {
  progress: number; // 0..1
  height?: number;
  style?: ViewStyle;
};

export function ProgressBar({ progress, height = 12, style }: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(17, 67, 73, 0.10)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
});
