import React from 'react';
import SDUITextInput from '../../components/inputs/SDUITextInput';
import SDUIDropdown from '../../components/inputs/SDUIDropdown';
import SDUIDatePicker from '../../components/inputs/SDUIDatePicker';
import SDUIPicker from '../../components/inputs/SDUIPicker';
import SDUIUpload from '../../components/inputs/SDUIUpload';

export const ComponentRegistry: Record<string, React.FC<any>> = {
  text: SDUITextInput,
  dropdown: SDUIDropdown,
  date: SDUIDatePicker,
  picker: SDUIPicker,
  upload: SDUIUpload,
};

export const getComponent = (type: string): React.FC<any> => {
  const comp = ComponentRegistry[type.toLowerCase()];
  if (!comp) {
    // Fallback to text input if type is unmapped
    return SDUITextInput;
  }
  return comp;
};

export default ComponentRegistry;
