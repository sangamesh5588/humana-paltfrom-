import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MonthYearPicker, { getDisplayDate } from './MonthYearPicker';

interface ProfileDateInputProps {
  label: string;
  value: string; // YYYY-MM
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ProfileDateInput: React.FC<ProfileDateInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  const handlePress = () => {
    if (value && value.includes('-')) {
      const [year, month] = value.split('-');
      setSelectedYear(year);
      setSelectedMonth(month);
    } else {
      setSelectedYear(String(new Date().getFullYear()));
      setSelectedMonth('01');
    }
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onChange(`${selectedYear}-${selectedMonth}`);
    setIsOpen(false);
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {required && '*'}
      </Text>
      <TouchableOpacity style={styles.dateSelectorTrigger} onPress={handlePress}>
        <Text style={[styles.dateSelectorText, !value && styles.placeholderText]}>
          {value ? getDisplayDate(value) : placeholder || 'Select Month & Year'}
        </Text>
      </TouchableOpacity>

      <MonthYearPicker
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelectMonth={setSelectedMonth}
        onSelectYear={setSelectedYear}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dateSelectorTrigger: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateSelectorText: {
    fontSize: 14,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
  },
});

export default ProfileDateInput;
