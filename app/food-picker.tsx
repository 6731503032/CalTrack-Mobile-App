import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
  View,
} from 'react-native';
import { CATEGORIES, FOOD_DATABASE, FoodItem } from '../constants/FoodDatabase';
import { MealStore, PendingFoodItem } from '../constants/MealStore';

function calColor(cal: number): string {
  if (cal < 150) return '#00E676';
  if (cal < 350) return '#FFD600';
  return '#FF5252';
}

export default function FoodPickerScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

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

  const handleSelect = (item: FoodItem): void => {
    const pending: PendingFoodItem = {
      id: Date.now().toString(),
      name: item.name,
      weight: 100,
      calories: item.cal,
      proteins: item.pro,
      fats: item.fat,
      carbs: item.carb,
    };
    MealStore.addPendingItem(pending);
    setAddedIds((prev) => new Set(prev).add(item.id));
    // Brief checkmark flash then go back
    setTimeout(() => router.back(), 350);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Food</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* --- Search --- */}
      <View style={styles.searchSection}>
        <Ionicons name="search-sharp" size={20} color="#8B949E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food..."
          placeholderTextColor="#8B949E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8B949E" />
          </TouchableOpacity>
        )}
      </View>

      {/* --- Categories --- */}
      <View style={{ height: 56 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
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

      {/* --- Food List --- */}
      <FlatList<FoodItem>
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const added = addedIds.has(item.id);
          return (
            <View style={styles.foodCard}>
              <Image source={{ uri: item.img }} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <View style={styles.foodTopRow}>
                  <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
                  <View style={[styles.calBadge, { backgroundColor: calColor(item.cal) + '22' }]}>
                    <Text style={[styles.calBadgeText, { color: calColor(item.cal) }]}>{item.cal} Cal</Text>
                  </View>
                </View>
                <Text style={styles.foodMacros}>
                  {`Per ${item.unit}  •  P:${item.pro}g  F:${item.fat}g  C:${item.carb}g`}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, added && styles.addBtnDone]}
                onPress={() => handleSelect(item)}
              >
                <Ionicons name={added ? 'checkmark-sharp' : 'add-sharp'} size={22} color="#0D1117" />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={40} color="#8B949E" />
            <Text style={styles.emptyText}>No food found.</Text>
            <Text style={styles.emptySubText}>Try a different search or category.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  backBtn: { width: 40, height: 40, backgroundColor: '#161B22', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: '#30363D', marginBottom: 4 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 48, color: '#FFFFFF', fontSize: 16 },
  catScroll: { paddingHorizontal: 20, alignItems: 'center' },
  catChip: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 16, backgroundColor: '#161B22', borderRadius: 20, borderWidth: 1, borderColor: '#30363D', marginRight: 8, alignItems: 'center' },
  catChipActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  catText: { color: '#C9D1D9', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#0D1117' },
  catEmoji: { fontSize: 12 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  foodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 14, padding: 12, marginTop: 12, borderWidth: 1, borderColor: '#30363D' },
  foodImage: { width: 52, height: 52, borderRadius: 10, marginRight: 12, backgroundColor: '#0D1117' },
  foodInfo: { flex: 1 },
  foodTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  foodName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', flex: 1, marginRight: 6 },
  foodMacros: { fontSize: 12, color: '#8B949E' },
  calBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  calBadgeText: { fontSize: 11, fontWeight: '700' },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#00E676', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  addBtnDone: { backgroundColor: '#00B0FF' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#C9D1D9', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  emptySubText: { color: '#8B949E', fontSize: 14, marginTop: 5 },
});