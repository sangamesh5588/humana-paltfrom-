import React from 'react';
import './ProfileBadge.css';

export interface ProfileBadgeData {
  text: string;
  bgColor?: string;
  textColor?: string;
  icon?: string;
  isCustom?: boolean;
}

export interface ProfileBadgeProps {
  badge?: ProfileBadgeData;
  fallbackStatus?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({
  badge,
  fallbackStatus,
  className = '',
  size = 'md',
}) => {
  // If badge prop missing, compute fallback
  const effectiveText = badge?.text || (fallbackStatus === 'STUDYING' ? 'Student' : fallbackStatus || 'Member');
  const effectiveBg = badge?.bgColor || '#3B82F6';
  const effectiveTextCol = badge?.textColor || '#FFFFFF';
  const effectiveIcon = badge?.icon || (effectiveText === 'Student' ? '🎓' : '👤');

  return (
    <span
      className={`profile-badge profile-badge--${size} ${className}`}
      style={{
        backgroundColor: effectiveBg,
        color: effectiveTextCol,
      }}
    >
      {effectiveIcon && <span className="profile-badge__icon">{effectiveIcon}</span>}
      <span className="profile-badge__text">{effectiveText}</span>
    </span>
  );
};

export default ProfileBadge;
