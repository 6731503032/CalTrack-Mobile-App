import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, StatusBar, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['All', 'Protein', 'Carbs', 'Fats', 'Fruits', 'Veggies'];

const FOOD_DATABASE = [
  { id: '1', name: 'Chicken Breast', cal: 165, pro: 31, fat: 3.6, carb: 0, unit: '100g', cat: 'Protein', img: 'https://cdn-icons-png.flaticon.com/512/2554/2554045.png' },
  { id: '2', name: 'Brown Rice', cal: 111, pro: 2.6, fat: 0.9, carb: 23, unit: '100g', cat: 'Carbs', img: 'https://cdn-icons-png.flaticon.com/512/11225/11225791.png' },
  { id: '3', name: 'Avocado', cal: 160, pro: 2, fat: 15, carb: 9, unit: '100g', cat: 'Fats', img: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png' },
  { id: '4', name: 'Egg (Large)', cal: 78, pro: 6, fat: 5, carb: 0.6, unit: '1pc', cat: 'Protein', img: 'https://cdn-icons-png.flaticon.com/512/2713/2713474.png' },
  { id: '5', name: 'Banana', cal: 89, pro: 1.1, fat: 0.3, carb: 23, unit: '100g', cat: 'Fruits', img: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png' },
  { id: '6', name: 'Salmon', cal: 208, pro: 20, fat: 13, carb: 0, unit: '100g', cat: 'Protein', img: 'https://cdn-icons-png.flaticon.com/512/1915/1915297.png' },
];

export default function FoodInfoScreen() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  
  const filteredFood = FOOD_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'All' || item.cat === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8B949E" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search for food..."
            placeholderTextColor="#8B949E"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#8B949E" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCat(cat)}
              style={[styles.catChip, activeCat === cat && styles.catChipActive]}
            >
              <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredFood}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = selectedFood === item.id;
          return (
            <TouchableOpacity 
              style={[styles.foodItemCard, isExpanded && styles.cardExpanded]} 
              onPress={() => setSelectedFood(isExpanded ? null : item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.mainRow}>
                <View style={styles.imgWrapper}>
                  <Image 
                    source={{ uri: item.img }} 
                    style={styles.foodImg} 
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.infoContent}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodSub}>{item.unit} • <Text style={styles.calHighlight}>{item.cal} Calories</Text></Text>
                </View>

                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#8B949E" 
                />
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  <Text style={styles.breakdownTitle}>Nutrition Info</Text>
                  <View style={styles.macroGrid}>
                    <View style={[styles.macroPill, { borderColor: '#30363D' }]}>
                      <Text style={[styles.macroVal, {color: '#00E5FF'}]}>{item.pro}g</Text>
                      <Text style={styles.macroLab}>Protein</Text>
                    </View>
                    <View style={[styles.macroPill, { borderColor: '#30363D' }]}>
                      <Text style={[styles.macroVal, {color: '#00E676'}]}>{item.fat}g</Text>
                      <Text style={styles.macroLab}>Fats</Text>
                    </View>
                    <View style={[styles.macroPill, { borderColor: '#30363D' }]}>
                      <Text style={[styles.macroVal, {color: '#FFD600'}]}>{item.carb}g</Text>
                      <Text style={styles.macroLab}>Carbs</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 20 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#161B22', 
    borderRadius: 15, 
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#30363D',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 16 },

  catList: { paddingHorizontal: 20, paddingVertical: 15, gap: 10 },
  catChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D' },
  catChipActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  catText: { color: '#C9D1D9', fontWeight: 'bold', fontSize: 14 },
  catTextActive: { color: '#0D1117' },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  foodItemCard: { 
    backgroundColor: '#161B22', 
    borderRadius: 18, 
    padding: 16, 
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#30363D',
  },
  cardExpanded: { borderColor: '#00E5FF' },
  mainRow: { flexDirection: 'row', alignItems: 'center' },
  imgWrapper: { width: 56, height: 56, backgroundColor: '#0D1117', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#30363D' },
  foodImg: { width: 40, height: 40 },
  infoContent: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  foodSub: { fontSize: 14, color: '#8B949E', marginTop: 4 },
  calHighlight: { color: '#00E676', fontWeight: 'bold' },
  
  expandedContent: { marginTop: 15 },
  divider: { height: 1, backgroundColor: '#30363D', marginBottom: 12 },
  breakdownTitle: { color: '#8B949E', fontSize: 12, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  macroPill: { flex: 1, backgroundColor: '#0D1117', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1.5 },
  macroVal: { fontSize: 18, fontWeight: '900' },
  macroLab: { fontSize: 11, color: '#C9D1D9', marginTop: 4, fontWeight: 'bold' }
});