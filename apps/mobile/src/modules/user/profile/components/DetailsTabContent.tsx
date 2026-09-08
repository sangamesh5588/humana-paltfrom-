import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchableDropdown from '../../onboarding/components/SearchableDropdown';
import ProfileFormInput from './ProfileFormInput';
import Theme from '../../../../app/theme';

interface DetailsTabContentProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  headline: string;
  setHeadline: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  currentCountryId: string;
  currentCountryName: string;
  onSelectCountry: (id: string, name: string) => void;
  currentCity: string;
  setCurrentCity: (val: string) => void;
}

export const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  headline,
  setHeadline,
  bio,
  setBio,
  currentCountryId,
  currentCountryName,
  onSelectCountry,
  currentCity,
  setCurrentCity,
}) => {
  return (
    <View style={styles.animatedSection}>
      <View style={styles.inputRow}>
        <View style={styles.rowItemLeft}>
          <ProfileFormInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Sangu"
            required
          />
        </View>

        <View style={styles.rowItemRight}>
          <ProfileFormInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Karsanga"
            required
          />
        </View>
      </View>

      <ProfileFormInput
        label="Headline"
        value={headline}
        onChangeText={setHeadline}
        placeholder="e.g. Developer / Lead Designer"
      />

      <ProfileFormInput
        label="About Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Describe your goals, passions, and background..."
        multiline
        numberOfLines={4}
      />

      {/* Country Autocomplete SearchableDropdown */}
      <View style={styles.dropdownWrapper}>
        <SearchableDropdown
          label="Current Country *"
          placeholder="Search and select country..."
          endpoint="countries"
          selectedValue={currentCountryId}
          selectedLabel={currentCountryName}
          onSelect={(item) => onSelectCountry(item.id, item.name)}
          required
        />
      </View>

      <ProfileFormInput
        label="Current City"
        value={currentCity}
        onChangeText={setCurrentCity}
        placeholder="e.g. Bengaluru, San Francisco"
        required
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animatedSection: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItemLeft: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  rowItemRight: {
    flex: 1,
  },
  dropdownWrapper: {
    marginBottom: 18,
    zIndex: 10,
    position: 'relative',
  },
});

export default DetailsTabContent;
