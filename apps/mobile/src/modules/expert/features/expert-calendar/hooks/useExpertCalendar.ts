import { useState } from 'react';
import { AvailabilitySlot, ExpertAppointment } from '../../../shared/types/expert.types';

export const useExpertCalendar = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([
    { id: '1', dayOfWeek: 'Monday', startTime: '10:00', endTime: '18:00', enabled: true },
    { id: '2', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '18:00', enabled: true },
    { id: '3', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '18:00', enabled: true },
    { id: '4', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '18:00', enabled: true },
    { id: '5', dayOfWeek: 'Friday', startTime: '10:00', endTime: '16:00', enabled: true },
    { id: '6', dayOfWeek: 'Saturday', startTime: '11:00', endTime: '14:00', enabled: false },
  ]);

  const [appointments] = useState<ExpertAppointment[]>([]);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, enabled: !slot.enabled } : slot))
    );
  };

  return {
    slots,
    appointments,
    toggleSlot,
  };
};

export default useExpertCalendar;
