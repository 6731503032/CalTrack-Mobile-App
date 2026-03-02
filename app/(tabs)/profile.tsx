import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GoalStore, UserGoals } from '../../constants/GoalStore';

// --- HELPER COMPONENT (Moved OUTSIDE to prevent focus loss) ---
const Field = ({
  label,
  field,
  unit,
  draft,
  setDraft,
  errors,
  setErrors,
  keyboardType = 'numeric',
  color = '#FFFFFF',
}: {
  label: string;
  field: keyof UserGoals;
  unit?: string;
  draft: UserGoals;
  setDraft: React.Dispatch<React.SetStateAction<UserGoals>>;
  errors: any;
  setErrors: any;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  color?: string;
}) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.fieldInputRow, errors[field] ? styles.fieldInputError : null]}>
      <TextInput
        style={[styles.fieldInput, { color }]}
        value={String(draft[field] === 0 ? '' : draft[field])} // Better UX: Don't show '0' when clearing
        keyboardType={keyboardType}
        autoCapitalize="none"
        onChangeText={(t) => {
          // Allow empty strings so users can actually delete numbers
          let val: string | number = t;
          if (keyboardType !== 'default') {
            val = t === '' ? 0 : parseFloat(t) || 0;
          }
          setDraft((prev) => ({ ...prev, [field]: val }));
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }}
        placeholderTextColor="#8B949E"
      />
      {unit && <Text style={styles.fieldUnit}>{unit}</Text>}
    </View>
    {errors[field] ? <Text style={styles.fieldError}>{errors[field]}</Text> : null}
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<UserGoals>(GoalStore.getGoals());
  const [modalVisible, setModalVisible] = useState(false);
  const [draft, setDraft] = useState<UserGoals>(goals);
  const [errors, setErrors] = useState<Partial<Record<keyof UserGoals, string>>>({});

  useEffect(() => {
    const unsub = GoalStore.subscribe(() => setGoals(GoalStore.getGoals()));
    return unsub;
  }, []);

  const openModal = () => {
    setDraft({ ...goals });
    setErrors({});
    setModalVisible(true);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserGoals, string>> = {};
    if (!draft.name.trim()) newErrors.name = 'Name is required';
    if (!draft.calorieGoal || draft.calorieGoal < 500) newErrors.calorieGoal = 'Min 500 Cal';
    if (!draft.waterGoal || draft.waterGoal < 0.5) newErrors.waterGoal = 'Min 0.5L';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await GoalStore.setGoals(draft);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person-outline" size={60} color="#00E5FF" />
          </View>
          <Text style={styles.userName}>{goals.name}</Text>
        </View>

        {/* My Info Button */}
        <TouchableOpacity style={styles.primaryCard} onPress={openModal}>
          <Text style={styles.primaryCardText}>My Info</Text>
          <View style={styles.row}>
            <Text style={styles.editLabel}>Edit</Text>
            <Ionicons name="chevron-forward-outline" size={18} color="#0D1117" />
          </View>
        </TouchableOpacity>

        {/* Goal Cards */}
        {[
          { label: 'Daily Calorie Goal', val: `${goals.calorieGoal.toLocaleString()} Cal`, icon: 'flame-outline', color: '#00E676' },
          { label: 'Daily Water Goal', val: `${goals.waterGoal}L`, icon: 'water-outline', color: '#00E5FF' },
          { label: 'Protein Goal', val: `${goals.proteinGoal}g`, icon: 'barbell-outline', color: '#FFD600' },
          { label: 'Fat Goal', val: `${goals.fatGoal}g`, icon: 'nutrition-outline', color: '#FF9500' },
          { label: 'Carb Goal', val: `${goals.carbGoal}g`, icon: 'leaf-outline', color: '#00E676' },
        ].map((item, i) => (
          <View key={i} style={styles.dataCard}>
            <View style={styles.dataLeft}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text style={styles.dataLabel}>{item.label}</Text>
            </View>
            <Text style={[styles.dataValue, { color: item.color }]}>{item.val}</Text>
          </View>
        ))}

        {/* Logout Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/(auth)/login')}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: '#FF5252' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- Edit Modal --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit My Info</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={28} color="#8B949E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Field label="Name" field="name" keyboardType="default" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
              <Field label="Calorie Goal" field="calorieGoal" unit="Cal" color="#00E676" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
              <Field label="Water Goal" field="waterGoal" unit="L" keyboardType="decimal-pad" color="#00E5FF" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
              <Field label="Protein Goal" field="proteinGoal" unit="g" color="#FFD600" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
              <Field label="Fat Goal" field="fatGoal" unit="g" color="#FF9500" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
              <Field label="Carb Goal" field="carbGoal" unit="g" color="#00E676" draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-outline" size={20} color="#0D1117" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#30363D', marginBottom: 12 },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  primaryCard: { backgroundColor: '#00E676', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 64 },
  primaryCardText: { color: '#0D1117', fontSize: 18, fontWeight: 'bold' },
  editLabel: { color: '#0D1117', fontSize: 16, fontWeight: '600', marginRight: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dataCard: { backgroundColor: '#161B22', borderRadius: 16, padding: 20, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 64, borderWidth: 1, borderColor: '#30363D' },
  dataLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dataLabel: { color: '#C9D1D9', fontSize: 16 },
  dataValue: { fontSize: 18, fontWeight: 'bold' },
  menuContainer: { marginTop: 20, backgroundColor: '#161B22', borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  menuIcon: { marginRight: 15 },
  menuText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: '#161B22', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#30363D', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  fieldWrapper: { marginBottom: 16 },
  fieldLabel: { color: '#8B949E', fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  fieldInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1117', borderRadius: 12, borderWidth: 1, borderColor: '#30363D', paddingHorizontal: 16, height: 52 },
  fieldInputError: { borderColor: '#FF453A' },
  fieldInput: { flex: 1, fontSize: 16 },
  fieldUnit: { color: '#8B949E', fontSize: 14, fontWeight: '600' },
  fieldError: { color: '#FF453A', fontSize: 12, marginTop: 4 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00E676', borderRadius: 16, height: 56, marginTop: 20, gap: 8 },
  saveBtnText: { color: '#0D1117', fontSize: 16, fontWeight: 'bold' },
});