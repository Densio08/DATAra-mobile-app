import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SmallCard = ({ title, children }: any) => (
  <View style={styles.smallCard}>
    <Text style={styles.smallCardTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  smallCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    width: '48%', // Ensure 2 cards sit next to each other
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
});
