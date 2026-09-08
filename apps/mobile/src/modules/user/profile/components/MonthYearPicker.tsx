import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const YEARS = Array.from({ length: 45 }, (_, i) => String(new Date().getFullYear() - i));

// Formats YYYY-MM to Jan 2024
export const getDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    const idx = parseInt(month, 10) - 1;
    return `${MONTHS[idx]} ${year}`;
  } catch {
    return dateStr;
  }
};

interface MonthYearPickerProps {
  visible: boolean;
  onClose: () => void;
  selectedMonth: string;
  selectedYear: string;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: string) => void;
  onConfirm: () => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  onClose,
  selectedMonth,
  selectedYear,
  onSelectMonth,
  onSelectYear,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.pickerBackdrop}>
        <View style={styles.pickerContent}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Month & Year</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerCols}>
            {/* Months column */}
            <ScrollView style={styles.pickerCol} showsVerticalScrollIndicator={false}>
              {MONTHS.map((m, idx) => {
                const val = String(idx + 1).padStart(2, '0');
                const isSelected = selectedMonth === val;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => onSelectMonth(val)}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Years column */}
            <ScrollView style={styles.pickerCol} showsVerticalScrollIndicator={false}>
              {YEARS.map((y) => {
                const isSelected = selectedYear === y;
                return (
                  <TouchableOpacity
                    key={y}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => onSelectYear(y)}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Confirm button */}
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>Confirm Date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  pickerCols: {
    flexDirection: 'row',
    height: 180,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  pickerCol: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: '#E2E8F0',
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemActive: {
    backgroundColor: '#0D9488',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#0D9488',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MonthYearPicker;
