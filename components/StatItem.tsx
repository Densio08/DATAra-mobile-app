import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StatItem = ({ icon, iconColor, iconBgColor, label, value, subValue }: any) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconContainer, { backgroundColor: iconBgColor }]}>
      <MaterialIcons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubValue}>{subValue}</Text>
  </View>
);

const styles = StyleSheet.create({
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 2,
  },
  statSubValue: {
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
