import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface IntervalSpreadProps {
  startDay: number;
  bestDay: number;
  deadlineDay: number;
}

export const IntervalSpread: React.FC<IntervalSpreadProps> = ({
  startDay,
  bestDay,
  deadlineDay,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Prediction Window</Text>

      {/* Tags above the bar */}
      <View style={styles.tagsRow}>
        <View style={styles.tagPillMuted}>
          <Text style={styles.tagMutedText}>Start</Text>
        </View>

        <View style={styles.bestDayBadgeWrapper}>
          <View style={styles.tagPillActive}>
            <Text style={styles.tagActiveText}>Best Day</Text>
          </View>
          <View style={styles.pointerTriangle} />
        </View>

        <View style={styles.tagPillDeadline}>
          <Text style={styles.tagDeadlineText}>Deadline</Text>
        </View>
      </View>

      {/* Visual timeline bar */}
      <View style={styles.timelineContainer}>
        {/* Background track */}
        <View style={styles.timelineTrack} />
        {/* Active highlight bar */}
        <View style={styles.timelineActiveSegment} />

        {/* Start node */}
        <View style={[styles.node, styles.startNode]}>
          <View style={styles.nodeInnerCircle} />
        </View>

        {/* Best Day star node */}
        <View style={[styles.node, styles.bestNode]}>
          <Text style={styles.starText}>★</Text>
        </View>

        {/* Deadline node */}
        <View style={[styles.node, styles.deadlineNode]}>
          <View style={styles.deadlineInnerCircle} />
        </View>
      </View>

      {/* Days labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.subDayText}>{`Day ${startDay}`}</Text>
        <Text style={styles.bestDayText}>{`Day ${bestDay}`}</Text>
        <Text style={styles.subDayText}>{`Day ${deadlineDay}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tagPillMuted: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  tagMutedText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  bestDayBadgeWrapper: {
    alignItems: 'center',
  },
  tagPillActive: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  tagActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
  tagPillDeadline: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  tagDeadlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.red,
  },
  timelineContainer: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 28,
    position: 'relative',
    marginVertical: 6,
  },
  timelineTrack: {
    position: 'absolute',
    left: 28,
    right: 28,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  timelineActiveSegment: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  node: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  startNode: {
    left: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nodeInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  bestNode: {
    left: '50%',
    backgroundColor: colors.primary,
  },
  starText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  deadlineNode: {
    right: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  deadlineInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  subDayText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  bestDayText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '800',
  },
});
