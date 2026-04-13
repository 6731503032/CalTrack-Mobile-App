import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Corrected import path for its location in app/(tabs)/
import { CATEGORIES, FOOD_DATABASE, FoodItem } from '../../constants/FoodDatabase';

function calColor(cal: number): string {
  if (cal < 150) return '#00E676';
  if (cal < 350) return '#FFD600';
  return '#FF5252';
}

export default function FoodDatabaseScreen() {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = useMemo<FoodItem[]>(() => {
    let data = FOOD_DATABASE;
    if (activeCategory !== 'All') {
      data = data.filter((item) => item.cat === activeCategory);
    }
    if (searchQuery.trim()) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  }, [activeCategory, searchQuery]);

  const showSpotlight = (activeCategory === 'All' || activeCategory === 'Thai') && !searchQuery.trim();
  const thaiItems = FOOD_DATABASE.filter((f) => f.cat === 'Thai').slice(0, 5);
  const listData = activeCategory === 'All' && !searchQuery.trim()
      ? filteredData.filter((f) => f.cat !== 'Thai')
      : filteredData;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Database</Text>
        <Text style={styles.headerSub}>{FOOD_DATABASE.length} items</Text>
      </View>

      <View style={styles.searchSection}>
        <Ionicons name="search-sharp" size={20} color="#8B949E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food by name..."
          placeholderTextColor="#8B949E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8B949E" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.catWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScrollView} contentContainerStyle={styles.catScrollContent}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              {cat === 'Thai' && <Text style={styles.catEmoji}>🇹🇭 </Text>}
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList<FoodItem>
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={showSpotlight ? (
          <View style={styles.spotlightSection}>
            <View style={styles.spotlightHeader}>
              <Text style={styles.spotlightTitle}>🇹🇭 Thai Dishes</Text>
              <TouchableOpacity onPress={() => setActiveCategory('Thai')}>
                <Text style={styles.spotlightSeeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thaiScrollContent}>
              {thaiItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.thaiCard} 
                  // Updated to match filename in app/ folder
                  onPress={() => navigation.navigate('FoodDetailScreen', { item })}
                >
                  <Image source={{ uri: item.img }} style={styles.thaiCardImg} />
                  <View style={styles.thaiCardBody}>
                    <Text style={styles.thaiCardName} numberOfLines={2}>{item.name}</Text>
                    <View style={[styles.calBadge, { backgroundColor: calColor(item.cal) + '22' }]}>
                      <Text style={[styles.calBadgeText, { color: calColor(item.cal) }]}>{item.cal} Cal</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {activeCategory === 'All' && <Text style={styles.sectionLabel}>All Foods</Text>}
          </View>
        ) : null}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.foodCard} 
            onPress={() => navigation.navigate('FoodDetailScreen', { item })}
          >
            <Image source={{ uri: item.img }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <View style={styles.foodTopRow}>
                <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.calBadge, { backgroundColor: calColor(item.cal) + '22' }]}>
                  <Text style={[styles.calBadgeText, { color: calColor(item.cal) }]}>{item.cal} Cal</Text>
                </View>
              </View>
              <Text style={styles.foodMacros}>{`Per ${item.unit} • P:${item.pro}g F:${item.fat}g C:${item.carb}g`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#8B949E' },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: '#30363D', marginBottom: 10, height: 48 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  catWrapper: { height: 52 },
  catScrollView: { width: '100%' },
  catScrollContent: { paddingLeft: 20, paddingRight: 40, alignItems: 'center' },
  catChip: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 16, backgroundColor: '#161B22', borderRadius: 20, borderWidth: 1, borderColor: '#30363D', marginRight: 8 },
  catChipActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  catText: { color: '#C9D1D9', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#0D1117' },
  catEmoji: { fontSize: 12 },
  spotlightSection: { paddingTop: 8 },
  spotlightHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 20 },
  spotlightTitle: { color: '#FFF', fontWeight: '800' },
  spotlightSeeAll: { color: '#00E676' },
  thaiScrollContent: { paddingLeft: 20, paddingRight: 20 },
  thaiCard: { width: 140, backgroundColor: '#161B22', borderRadius: 14, marginRight: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#30363D' },
  thaiCardImg: { width: '100%', height: 90 },
  thaiCardBody: { padding: 10 },
  thaiCardName: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  sectionLabel: { marginTop: 20, marginBottom: 4, paddingHorizontal: 20, color: '#FFF', fontWeight: '800' },
  listContainer: { paddingBottom: 120 },
  foodCard: { flexDirection: 'row', backgroundColor: '#161B22', marginHorizontal: 20, marginTop: 12, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#30363D' },
  foodImage: { width: 56, height: 56, borderRadius: 10, marginRight: 14 },
  foodInfo: { flex: 1 },
  foodTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  foodName: { color: '#FFF', fontWeight: 'bold', flex: 1 },
  foodMacros: { color: '#8B949E', fontSize: 12, marginTop: 4 },
  calBadge: { paddingHorizontal: 8, borderRadius: 8, justifyContent: 'center' },
  calBadgeText: { fontWeight: '700', fontSize: 12 },
});