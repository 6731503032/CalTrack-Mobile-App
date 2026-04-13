import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Corrected import path for its location in app/
import { FoodItem } from '../constants/FoodDatabase';

type RootStackParamList = {
  FoodDetailScreen: { item: FoodItem };
};

type FoodDetailRouteProp = RouteProp<RootStackParamList, 'FoodDetailScreen'>;

const getCalColor = (cal: number) => {
  if (cal < 150) return '#00E676';
  if (cal < 350) return '#FFD600';
  return '#FF5252';
};

export default function FoodDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<FoodDetailRouteProp>();
  const { item } = route.params;

  const calColor = getCalColor(item.cal);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: item.img }} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>
        
        <View style={[styles.calorieBox, { backgroundColor: calColor + '22' }]}>
          <Text style={[styles.calorieText, { color: calColor }]}>
            {item.cal} Calories
          </Text>
        </View>

        <View style={styles.macros}>
          <Text style={styles.macro}>Protein: {item.pro}g</Text>
          <Text style={styles.macro}>Fat: {item.fat}g</Text>
          <Text style={styles.macro}>Carbs: {item.carb}g</Text>
        </View>

        <Text style={styles.unit}>Portion: {item.unit}</Text>
        {!!item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  image: { width: '100%', height: 300 },
  body: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 15 },
  calorieBox: { padding: 15, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  calorieText: { fontSize: 18, fontWeight: '700' },
  macros: { marginBottom: 20, backgroundColor: '#161B22', padding: 15, borderRadius: 12 },
  macro: { color: '#C9D1D9', fontSize: 16, marginBottom: 8 },
  unit: { color: '#8B949E', fontSize: 14, marginBottom: 10 },
  description: { color: '#8B949E', fontSize: 14, lineHeight: 20 },
});