import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrackerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed View</Text>
      
      {/* Upper Box: For the Graph Tracking */}
      <View style={styles.box}>
        <Text style={styles.placeholderText}>Graph Tracking Placeholder</Text>
      </View>
      
      {/* Lower Box: For Adding Food Items */}
      <View style={styles.box}>
        <Text style={styles.placeholderText}>Add Food Item Placeholder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Keeps the background clean
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700', // Slightly bolder for the header
    color: '#333',
  },
  box: {
    width: '85%',
    height: 180, // Increased height slightly for better visual balance
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12, // Rounded corners for a modern look
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
});