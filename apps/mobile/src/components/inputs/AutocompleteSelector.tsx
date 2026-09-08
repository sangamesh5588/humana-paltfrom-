import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import ApiClient from '../../core/api/client';

interface AutocompleteSelectorProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  searchEndpoint: string; // e.g., '/companies/search' or '/job-titles/search'
  dataKey: string; // e.g., 'name' for company, 'title' for job title
  disabled?: boolean;
  isRequired?: boolean;
}

export const AutocompleteSelector: React.FC<AutocompleteSelectorProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  searchEndpoint,
  dataKey,
  disabled = false,
  isRequired = false,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const response = await ApiClient.get(searchEndpoint, {
        params: { q: query, limit: 10 }
      });
      // Handle page-based pagination response (usually { data: [...] } or direct array)
      const dataList = response.data?.data || response.data || [];
      setSuggestions(dataList);
      setShowDropdown(true);
    } catch (error) {
      console.warn(`Autocomplete failed fetching from ${searchEndpoint}:`, error);
      setSuggestions([]);
      // Still show dropdown so they can add their custom entry
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    isSelectingRef.current = false;

    // Debounce the API call (300ms)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (text.trim().length > 1) {
      // Immediately show dropdown with custom add option while typing
      setShowDropdown(true);
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectItem = (item: any) => {
    isSelectingRef.current = true;
    const selectedValue = item[dataKey];
    onChangeText(selectedValue);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleBlur = () => {
    // Delay hiding dropdown so press events can register
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setShowDropdown(false);
      }
    }, 200);
  };

  const handleFocus = () => {
    if (value.trim().length > 1) {
      setShowDropdown(true);
    }
  };

  // Determine if the custom "+ Add new" option should be shown
  const showCustomAdd = value.trim().length > 1 && 
    !suggestions.some(item => (item[dataKey] || '').toLowerCase() === value.toLowerCase().trim());
  const hasSuggestions = suggestions.length > 0;
  const isDropdownVisible = showDropdown && (hasSuggestions || showCustomAdd);

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            disabled && styles.inputDisabled,
            isDropdownVisible && styles.inputWithDropdown
          ]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          editable={!disabled}
        />
        {loading && (
          <ActivityIndicator 
            size="small" 
            color="#0D9488" 
            style={styles.loader} 
          />
        )}
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            {/* List suggestions from database */}
            {suggestions.map((item, index) => {
              const displayVal = item[dataKey] || '';
              return (
                <TouchableOpacity
                  key={item.id || String(index)}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {displayVal}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Custom entry selector option */}
            {showCustomAdd && (
              <TouchableOpacity
                style={[styles.suggestionItem, styles.customAddItem]}
                onPress={() => handleSelectItem({ [dataKey]: value })}
              >
                <Text style={styles.customAddText} numberOfLines={1}>
                  + Add "{value}" as a new {label.toLowerCase()}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#DC2626',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  inputDisabled: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
  },
  inputWithDropdown: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    borderColor: '#0D9488',
  },
  loader: {
    position: 'absolute',
    right: 16,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D9488',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 180,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  list: {
    maxHeight: 180,
  },
  listContent: {
    paddingVertical: 4,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 14,
    color: '#0F172A',
  },
  customAddItem: {
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  customAddText: {
    fontSize: 13.5,
    color: '#15803D',
    fontWeight: 'bold',
  },
});

export default AutocompleteSelector;
