export const getInitials = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName.slice(0, 1).toUpperCase()}${lastName.slice(0, 1).toUpperCase()}`;
  }
  if (firstName) {
    return firstName.slice(0, 1).toUpperCase();
  }
  return 'U';
};

export const isDarkColor = (hexColor: string): boolean => {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return false;
  try {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  } catch {
    return false;
  }
};

export interface DynamicBadgeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  icon?: string;
}

export const getStatusBadgeConfig = (profileOrStatus?: any): DynamicBadgeConfig => {
  if (typeof profileOrStatus === 'object' && profileOrStatus !== null) {
    if (profileOrStatus.badgeText) {
      return {
        label: profileOrStatus.badgeText,
        bgColor: profileOrStatus.badgeBgColor || '#2563EB',
        textColor: profileOrStatus.badgeTextColor || '#FFFFFF',
        icon: profileOrStatus.badgeIcon || '🎓',
      };
    }
    if (profileOrStatus.effectiveBadge) {
      return {
        label: profileOrStatus.effectiveBadge.text,
        bgColor: profileOrStatus.effectiveBadge.bgColor,
        textColor: profileOrStatus.effectiveBadge.textColor,
        icon: profileOrStatus.effectiveBadge.icon,
      };
    }
    return getStatusBadgeConfig(profileOrStatus.currentStatus);
  }

  const status = profileOrStatus;
  if (!status) return { label: 'Professional Member', bgColor: '#64748B', textColor: '#FFFFFF' };
  const s = String(status).toUpperCase().trim();
  if (s.startsWith('CLASS') || s === 'LKG' || s === 'UKG' || /^\d+/.test(s)) {
    return { label: s.replace('CLASS', 'Class'), bgColor: '#7C3AED', textColor: '#FFFFFF', icon: '🎓' };
  }
  switch (s) {
    case 'STUDYING':
      return { label: 'Student', bgColor: '#2563EB', textColor: '#FFFFFF', icon: '🎓' };
    case 'WORKING':
      return { label: 'Working', bgColor: '#16A34A', textColor: '#FFFFFF', icon: '💼' };
    case 'LOOKING':
    case 'EXPLORING':
      return { label: 'Exploring', bgColor: '#EA580C', textColor: '#FFFFFF', icon: '🔍' };
    default:
      const capitalized = String(status).charAt(0).toUpperCase() + String(status).slice(1).toLowerCase();
      return { label: capitalized, bgColor: '#64748B', textColor: '#FFFFFF' };
  }
};

