import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  StatusBar, 
  Platform, 
  ActivityIndicator, 
  Alert, 
  Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Save, Split, Sparkles, ChevronDown, Check, X } from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

interface DaySchedule {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  hasSplitShift?: boolean;
  splitStartTime?: string;
  splitEndTime?: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Generate 24-hour slots with 30-minute increments
const TIME_SLOTS = (() => {
  const slots: { label: string; value: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const hStr = hour.toString().padStart(2, '0');
      const mStr = min.toString().padStart(2, '0');
      const val = `${hStr}:${mStr}`;
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${displayHour}:${mStr} ${period}`;
      
      slots.push({ label, value: val });
    }
  }
  return slots;
})();

const formatTimeLabel = (timeStr: string) => {
  if (!timeStr) return '09:00 AM';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return timeStr;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${min} ${period}`;
};

export const ConsultationHoursScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [bufferMinutes, setBufferMinutes] = useState<number>(15);
  const [noticeHours, setNoticeHours] = useState<number>(2);
  const [timezone, setTimezone] = useState<string>('UTC');

  // Time Picker Modal State
  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    dayIndex: number;
    field: keyof DaySchedule;
    currentValue: string;
    title: string;
  }>({
    visible: false,
    dayIndex: 0,
    field: 'startTime',
    currentValue: '09:00',
    title: 'Select Start Time',
  });

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await ExpertApi.getAvailability();
      if (data && data.schedules) {
        setSchedules(data.schedules);
        setBufferMinutes(data.bufferMinutes || 15);
        setNoticeHours(data.noticeHours || 2);
        setTimezone(data.timezone || 'UTC');
      }
    } catch {
      // Fallback defaults
      setSchedules(
        [0, 1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          isAvailable: day >= 1 && day <= 5,
          startTime: '09:00',
          endTime: '17:00',
          hasSplitShift: false,
          splitStartTime: '14:00',
          splitEndTime: '18:00',
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayIndex ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleToggleSplitShift = (dayIndex: number) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayIndex ? { ...item, hasSplitShift: !item.hasSplitShift } : item
      )
    );
  };

  const openTimePicker = (dayIndex: number, field: keyof DaySchedule, currentValue: string, fieldTitle: string) => {
    setPickerModal({
      visible: true,
      dayIndex,
      field,
      currentValue: currentValue || '09:00',
      title: fieldTitle,
    });
  };

  const selectTime = (val: string) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.dayOfWeek === pickerModal.dayIndex ? { ...item, [pickerModal.field]: val } : item
      )
    );
    setPickerModal((prev) => ({ ...prev, visible: false }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitizedSchedules = schedules.map((s) => ({
        dayOfWeek: Number(s.dayOfWeek),
        isAvailable: Boolean(s.isAvailable),
        startTime: String(s.startTime || '09:00'),
        endTime: String(s.endTime || '17:00'),
        hasSplitShift: Boolean(s.hasSplitShift),
        splitStartTime: String(s.splitStartTime || '14:00'),
        splitEndTime: String(s.splitEndTime || '18:00'),
      }));

      const payload = {
        schedules: sanitizedSchedules,
        bufferMinutes: Number(bufferMinutes),
        noticeHours: Number(noticeHours),
        timezone: String(timezone),
      };

      const res = await ExpertApi.saveAvailability(payload);
      if (res && res.schedules) {
        setSchedules(res.schedules);
        setBufferMinutes(res.bufferMinutes);
        setNoticeHours(res.noticeHours);
      }

      Alert.alert('Schedule Saved', 'Your custom consultation hours and buffer rules have been saved and updated in the database.');
    } catch (err: any) {
      Alert.alert('Save Failed', err.message || 'Unable to update availability settings in database.');
    } finally {
      setSaving(false);
    }
  };

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0369A1" />
        <Text style={styles.loadingText}>Loading availability schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0369A1" translucent />

      {/* Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Consultation Hours</Text>
        </View>

        <TouchableOpacity 
          style={styles.saveHeaderBtn} 
          onPress={handleSave} 
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#0369A1" />
          ) : (
            <>
              <Save size={15} color="#0369A1" />
              <Text style={styles.saveHeaderBtnText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Hero Banner */}
        <View style={styles.heroBanner}>
          <Sparkles size={20} color="#0369A1" />
          <View style={styles.heroBannerTextCol}>
            <Text style={styles.heroBannerTitle}>Custom Booking Availability</Text>
            <Text style={styles.heroBannerSub}>Tap any time box to select custom hours without typing.</Text>
          </View>
        </View>

        {/* Booking Buffer & Notice Rules */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Booking & Buffer Controls</Text>

          {/* Buffer Minutes Picker */}
          <View style={styles.controlRow}>
            <View style={styles.controlLabelCol}>
              <Text style={styles.controlLabel}>Session Buffer Break</Text>
              <Text style={styles.controlSub}>Automatic break between sessions</Text>
            </View>
            <View style={styles.chipsRow}>
              {[0, 15, 30, 45].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[styles.chip, bufferMinutes === mins && styles.chipActive]}
                  onPress={() => setBufferMinutes(mins)}
                >
                  <Text style={[styles.chipText, bufferMinutes === mins && styles.chipTextActive]}>
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Advance Notice Hours */}
          <View style={styles.controlRow}>
            <View style={styles.controlLabelCol}>
              <Text style={styles.controlLabel}>Minimum Advance Notice</Text>
              <Text style={styles.controlSub}>Prior notice required to book</Text>
            </View>
            <View style={styles.chipsRow}>
              {[1, 2, 6, 24].map((hrs) => (
                <TouchableOpacity
                  key={hrs}
                  style={[styles.chip, noticeHours === hrs && styles.chipActive]}
                  onPress={() => setNoticeHours(hrs)}
                >
                  <Text style={[styles.chipText, noticeHours === hrs && styles.chipTextActive]}>
                    {hrs === 1 ? '1 hr' : `${hrs} hrs`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Weekly Day Schedule List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Schedule (Mon – Sun)</Text>

          <View style={styles.daysList}>
            {schedules.map((day) => (
              <View key={day.dayOfWeek} style={styles.dayCard}>
                {/* Day Header Row */}
                <View style={styles.dayHeaderRow}>
                  <Text style={styles.dayName}>{DAY_NAMES[day.dayOfWeek]}</Text>
                  
                  <View style={styles.dayRightCol}>
                    <Text style={[styles.dayStatusText, day.isAvailable ? styles.activeText : styles.inactiveText]}>
                      {day.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                    <Switch
                      value={day.isAvailable}
                      onValueChange={() => handleToggleDay(day.dayOfWeek)}
                      trackColor={{ false: '#E2E8F0', true: '#BAE6FD' }}
                      thumbColor={day.isAvailable ? '#0369A1' : '#94A3B8'}
                    />
                  </View>
                </View>

                {/* Tappable Time Picker Selectors */}
                {day.isAvailable && (
                  <View style={styles.timeInputsContainer}>
                    {/* Shift 1 */}
                    <View style={styles.shiftRow}>
                      <Clock size={16} color="#0369A1" />
                      
                      <View style={styles.timePickerBoxCol}>
                        <Text style={styles.inputLabel}>Start Time</Text>
                        <TouchableOpacity
                          style={styles.timePickerBtn}
                          onPress={() => openTimePicker(day.dayOfWeek, 'startTime', day.startTime, `${DAY_NAMES[day.dayOfWeek]} Start Time`)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.timePickerBtnText}>{formatTimeLabel(day.startTime)}</Text>
                          <ChevronDown size={14} color="#64748B" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.toText}>to</Text>

                      <View style={styles.timePickerBoxCol}>
                        <Text style={styles.inputLabel}>End Time</Text>
                        <TouchableOpacity
                          style={styles.timePickerBtn}
                          onPress={() => openTimePicker(day.dayOfWeek, 'endTime', day.endTime, `${DAY_NAMES[day.dayOfWeek]} End Time`)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.timePickerBtnText}>{formatTimeLabel(day.endTime)}</Text>
                          <ChevronDown size={14} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Split Shift Toggle */}
                    <TouchableOpacity 
                      style={styles.splitToggleBtn}
                      onPress={() => handleToggleSplitShift(day.dayOfWeek)}
                      activeOpacity={0.7}
                    >
                      <Split size={14} color="#0369A1" />
                      <Text style={styles.splitToggleText}>
                        {day.hasSplitShift ? 'Remove Split Shift' : '+ Add Afternoon Split Shift'}
                      </Text>
                    </TouchableOpacity>

                    {/* Split Shift Slot 2 */}
                    {day.hasSplitShift && (
                      <View style={[styles.shiftRow, styles.splitShiftRow]}>
                        <Clock size={16} color="#D97706" />

                        <View style={styles.timePickerBoxCol}>
                          <Text style={styles.inputLabel}>Shift 2 Start</Text>
                          <TouchableOpacity
                            style={styles.timePickerBtn}
                            onPress={() => openTimePicker(day.dayOfWeek, 'splitStartTime', day.splitStartTime || '14:00', `${DAY_NAMES[day.dayOfWeek]} Shift 2 Start`)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.timePickerBtnText}>{formatTimeLabel(day.splitStartTime || '14:00')}</Text>
                            <ChevronDown size={14} color="#64748B" />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.toText}>to</Text>

                        <View style={styles.timePickerBoxCol}>
                          <Text style={styles.inputLabel}>Shift 2 End</Text>
                          <TouchableOpacity
                            style={styles.timePickerBtn}
                            onPress={() => openTimePicker(day.dayOfWeek, 'splitEndTime', day.splitEndTime || '18:00', `${DAY_NAMES[day.dayOfWeek]} Shift 2 End`)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.timePickerBtnText}>{formatTimeLabel(day.splitEndTime || '18:00')}</Text>
                            <ChevronDown size={14} color="#64748B" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modal Sheet */}
      <Modal visible={pickerModal.visible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setPickerModal((prev) => ({ ...prev, visible: false }))}
        >
          <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.pickerModalTitle}>{pickerModal.title}</Text>
              <TouchableOpacity 
                onPress={() => setPickerModal((prev) => ({ ...prev, visible: false }))}
                style={styles.closeBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = pickerModal.currentValue === slot.value;
                return (
                  <TouchableOpacity
                    key={slot.value}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => selectTime(slot.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {slot.label}
                    </Text>
                    {isSelected && <Check size={16} color="#0369A1" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#0369A1',
    borderBottomWidth: 1,
    borderBottomColor: '#0284C7',
  },
  backBtn: {
    padding: 4,
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  saveHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveHeaderBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 12,
  },
  heroBannerTextCol: {
    flex: 1,
    gap: 2,
  },
  heroBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
  heroBannerSub: {
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
    opacity: 0.85,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  controlRow: {
    gap: 10,
  },
  controlLabelCol: {
    gap: 2,
  },
  controlLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  controlSub: {
    fontSize: 12,
    color: '#64748B',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  daysList: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  dayRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeText: {
    color: '#0369A1',
  },
  inactiveText: {
    color: '#94A3B8',
  },
  timeInputsContainer: {
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitShiftRow: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
  },
  timePickerBoxCol: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  timePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  timePickerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  toText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 16,
  },
  splitToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  splitToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModalContent: {
    width: '100%',
    maxHeight: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pickerItemActive: {
    backgroundColor: '#F0F9FF',
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  pickerItemTextActive: {
    fontWeight: '800',
    color: '#0369A1',
  },
});

export default ConsultationHoursScreen;
