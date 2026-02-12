import { View, Text, StyleSheet } from 'react-native';
//homescreen
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello Bon!</Text>
      <View style={styles.card}>
        <Text style={styles.placeholder}>[ Daily Nutrient Totals ]</Text>
        <Text>Calories: 0 / 3400 kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
  },
  card: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  placeholder: {
    color: '#888',
    marginBottom: 10,
  },
});