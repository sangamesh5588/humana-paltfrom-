import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useMasterDataSearch } from '../hooks/useMasterDataSearch';
import ApiClient from '../../../../core/api/client';
import Theme from '../../../../app/theme';

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  endpoint: string;
  selectedValue: string;
  selectedLabel: string;
  onSelect: (item: { id: string; name: string }) => void;
  labelKey?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  placeholder,
  endpoint,
  selectedValue,
  selectedLabel,
  onSelect,
  labelKey = 'name',
  allowCustom = false,
  disabled = false,
}) => {
  const { query, setQuery, results, isLoading, refresh } = useMasterDataSearch(endpoint);
  const [isFocused, setIsFocused] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const hasSelectedRef = useRef(!!selectedValue || !!selectedLabel);
  const mountedRef = useRef(false);
  const lastSelectedLabelRef = useRef(selectedLabel);

  // Initialize query from selectedLabel on first render
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (selectedLabel) {
        setQuery(selectedLabel);
        hasSelectedRef.current = true;
      }
    }
  }, []);

  // Sync internal query with selectedLabel when parent state changes externally (and input is not focused)
  useEffect(() => {
    if (!isFocused && selectedLabel !== lastSelectedLabelRef.current) {
      setQuery(selectedLabel || '');
      lastSelectedLabelRef.current = selectedLabel;
      hasSelectedRef.current = !!selectedLabel;
    }
  }, [selectedLabel, isFocused]);

  const handleSelect = (item: any) => {
    const name = item[labelKey] || item.name;
    setQuery(name);
    onSelect({ id: item.id, name });
    lastSelectedLabelRef.current = name;
    hasSelectedRef.current = true;
    setIsFocused(false);
  };

  const handleCustomSubmit = async () => {
    if (!allowCustom || !query.trim()) return;

    const trimmed = query.trim();
    setIsCreating(true);

    try {
      const response = await ApiClient.post(`${endpoint}/find-or-create`, {
        name: trimmed,
      });

      const created = response.data;
      const finalName = created[labelKey] || created.name || trimmed;
      setQuery(finalName);
      onSelect({ id: created.id, name: finalName });
      lastSelectedLabelRef.current = finalName;
      hasSelectedRef.current = true;
      refresh();
    } catch (error) {
      console.warn('find-or-create failed, using custom value:', error);
      onSelect({ id: 'custom', name: trimmed });
      lastSelectedLabelRef.current = trimmed;
      hasSelectedRef.current = true;
    } finally {
      setIsCreating(false);
      setIsFocused(false);
    }
  };

  // Guard: when user taps a dropdown item, prevent blur from dismissing
  const pressedItemRef = useRef(false);

  const handleBlur = () => {
    setTimeout(() => {
      // If user just pressed a dropdown item, skip blur logic
      if (pressedItemRef.current) {
        pressedItemRef.current = false;
        return;
      }
      setIsFocused(false);
      const trimmed = query.trim();
      if (allowCustom && trimmed && !hasSelectedRef.current) {
        // Check if query matches an existing result
        const matchedItem = (results || []).find(
          (item) => (item[labelKey] || item.name || '').toLowerCase() === trimmed.toLowerCase()
        );
        if (matchedItem) {
          handleSelect(matchedItem);
        } else {
          handleCustomSubmit();
        }
      }
    }, 300);
  };

  const handleChangeText = (val: string) => {
    setQuery(val);
    // User is typing — reopen dropdown and clear previous selection status
    setIsFocused(true);
    hasSelectedRef.current = false;
    
    // Update parent in real-time so that clicks on "Save" or other buttons immediately get the updated text
    onSelect({ id: '', name: val });
    lastSelectedLabelRef.current = val;
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  // Only display dropdown if focused, selection is not complete, and there's text/results
  const isDropdownVisible = isFocused && !hasSelectedRef.current && (query.trim().length > 0 || (Array.isArray(results) && results.length > 0));

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input, 
            isFocused && styles.inputFocused,
            disabled && styles.inputDisabled
          ]}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleCustomSubmit}
          editable={!disabled}
        />
        {isLoading && (
          <ActivityIndicator size="small" color={Theme.colors.accent} style={styles.loader} />
        )}
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdownCard}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.dropdownScrollView}
          >
            {Array.isArray(results) && results.length > 0 ? (
              results.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionItem}
                  onPressIn={() => { pressedItemRef.current = true; }}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item[labelKey] || item.name}</Text>
                </TouchableOpacity>
              ))
            ) : !isLoading ? (
              allowCustom ? (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPressIn={() => { pressedItemRef.current = true; }}
                  onPress={handleCustomSubmit}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <View style={styles.creatingRow}>
                      <ActivityIndicator size="small" color={Theme.colors.accent} />
                      <Text style={styles.optionTextCustom}>  Adding "{query}"...</Text>
                    </View>
                  ) : (
                    <Text style={styles.optionTextCustom}>+ Add "{query}" as a new {label.toLowerCase().replace('*', '').trim()}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.optionItem}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              )
            ) : null}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 15,
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textMain,
  },
  inputFocused: {
    borderColor: Theme.colors.primary,
  },
  inputDisabled: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
    borderColor: '#E2E8F0',
  },
  loader: {
    position: 'absolute',
    right: Theme.spacing.md,
  },
  dropdownCard: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    marginTop: 4,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999,
  },
  optionItem: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  optionText: {
    fontSize: 14,
    color: Theme.colors.textMain,
  },
  optionTextCustom: {
    fontSize: 14,
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  creatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
});

export default SearchableDropdown;
