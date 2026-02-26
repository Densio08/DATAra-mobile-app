import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const BottomNavItem = ({ iconName, label, isActive, onPress }: any) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <MaterialIcons name={iconName} size={26} color={isActive ? '#3b00ff' : '#9ca3af'} />
    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%', // Exactly 4 buttons to fill the row
  },
  navLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#3b00ff',
  },
});
