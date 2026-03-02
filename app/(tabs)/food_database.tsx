import { Ionicons } from '@expo/vector-icons';
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
import { CATEGORIES, FOOD_DATABASE, FoodItem } from '../../constants/FoodDatabase';

// Calorie colour indicator — green/yellow/red based on density
function calColor(cal: number): string {
  if (cal < 150) return '#00E676';
  if (cal < 350) return '#FFD600';
  return '#FF5252';
}

export default function FoodDatabaseScreen() {
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

  // Thai spotlight — shown only when "All" or "Thai" selected and no search
  const showSpotlight = (activeCategory === 'All' || activeCategory === 'Thai') && !searchQuery.trim();
  const thaiItems = FOOD_DATABASE.filter((f) => f.cat === 'Thai').slice(0, 5);

  // Non-Thai items for the main list (avoid duplication in spotlight)
  const listData = activeCategory === 'All' && !searchQuery.trim()
    ? filteredData.filter((f) => f.cat !== 'Thai')
    : filteredData;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Database</Text>
        <Text style={styles.headerSub}>{FOOD_DATABASE.length} items</Text>
      </View>

      {/* --- Search Bar --- */}
      <View style={styles.searchSection}>
        <Ionicons name="search-sharp" size={20} color="#8B949E" style={styles.searchIcon} />
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

      {/* --- Category Filter --- */}
      <View style={{ height: 56 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              {cat === 'Thai' && (
                <Text style={styles.catEmoji}>🇹🇭 </Text>
              )}
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList<FoodItem>
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          showSpotlight ? (
            <View style={styles.spotlightSection}>
              <View style={styles.spotlightHeader}>
                <Text style={styles.spotlightTitle}>🇹🇭  Thai Dishes</Text>
                <TouchableOpacity onPress={() => setActiveCategory('Thai')}>
                  <Text style={styles.spotlightSeeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {thaiItems.map((item) => (
                  <View key={item.id} style={styles.thaiCard}>
                    <Image source={{ uri: item.img }} style={styles.thaiCardImg} />
                    <View style={styles.thaiCardBody}>
                      <Text style={styles.thaiCardName} numberOfLines={2}>{item.name}</Text>
                      <View style={[styles.calBadge, { backgroundColor: calColor(item.cal) + '22' }]}>
                        <Text style={[styles.calBadgeText, { color: calColor(item.cal) }]}>
                          {item.cal} Cal
                        </Text>
                      </View>
                      <Text style={styles.thaiCardUnit}>{item.unit}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {activeCategory === 'All' && (
                <Text style={styles.sectionLabel}>All Foods</Text>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <Image source={{ uri: item.img }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <View style={styles.foodTopRow}>
                <Text style={styles.foodName}>{item.name}</Text>
                <View style={[styles.calBadge, { backgroundColor: calColor(item.cal) + '22' }]}>
                  <Text style={[styles.calBadgeText, { color: calColor(item.cal) }]}>
                    {item.cal} Cal
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text style={styles.foodDesc} numberOfLines={1}>{item.description}</Text>
              )}
              <Text style={styles.foodMacros}>
                {`Per ${item.unit}  •  P:${item.pro}g  F:${item.fat}g  C:${item.carb}g`}
              </Text>
            </View>
          </View>
        )}
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

  // Header
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: '#8B949E' },

  // Search
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: '#30363D', marginBottom: 8 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 48, color: '#FFFFFF', fontSize: 16 },

  // Categories
  catScroll: { paddingHorizontal: 20, alignItems: 'center' },
  catChip: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 16, backgroundColor: '#161B22', borderRadius: 20, borderWidth: 1, borderColor: '#30363D', marginRight: 8, alignItems: 'center' },
  catChipActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  catText: { color: '#C9D1D9', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#0D1117' },
  catEmoji: { fontSize: 12 },

  // Thai spotlight
  spotlightSection: { paddingTop: 8, paddingBottom: 4 },
  spotlightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  spotlightTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  spotlightSeeAll: { fontSize: 13, color: '#00E676', fontWeight: '600' },
  thaiCard: { width: 140, backgroundColor: '#161B22', borderRadius: 14, marginRight: 12, borderWidth: 1, borderColor: '#30363D', overflow: 'hidden' },
  thaiCardImg: { width: '100%', height: 90 },
  thaiCardBody: { padding: 10 },
  thaiCardName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 6, lineHeight: 18 },
  thaiCardUnit: { fontSize: 11, color: '#8B949E', marginTop: 4 },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginTop: 20, marginBottom: 4 },

  // Food list
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  foodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 15, padding: 12, marginTop: 12, borderWidth: 1, borderColor: '#30363D' },
  foodImage: { width: 56, height: 56, borderRadius: 10, marginRight: 14, backgroundColor: '#0D1117' },
  foodInfo: { flex: 1 },
  foodTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  foodName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', flex: 1, marginRight: 8 },
  foodDesc: { fontSize: 12, color: '#8B949E', marginBottom: 4 },
  foodMacros: { fontSize: 12, color: '#8B949E' },
  calBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  calBadgeText: { fontSize: 12, fontWeight: '700' },

  // Empty
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#C9D1D9', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  emptySubText: { color: '#8B949E', fontSize: 14, marginTop: 5 },
});