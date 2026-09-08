export const Palette = {
  background: '#FFFFFF',       // Pure clean white background
  surface: '#FFFFFF',          // Pure white cards, inputs
  primary: '#111827',          // Charcoal/black (mockup primary color)
  accent: '#0F766E',           // Deep Teal (brand accent)
  secondary: '#6B7280',        // Medium gray
  textMain: '#111827',         // Deep charcoal text
  textSecondary: '#6B7280',    // Medium gray text
  border: '#E5E7EB',           // Subtle borders
  error: '#DC2626',            // Red 600
  warning: '#F59E0B',          // Amber 500
  success: '#16A34A',          // Green 600

  // Semantic Expert Theme Tokens
  expertCareer: '#0369A1',     // Steel Blue
  expertEducation: '#4F46E5',  // Deep Indigo
  expertSkills: '#D97706',     // Warm Amber Gold
  expertEarnings: '#059669',   // Vivid Emerald
  expertCalendar: '#0284C7',   // Sapphire Blue
  expertSuccess: '#059669',    // Verified Emerald
  expertPending: '#D97706',    // Audit Amber
  expertError: '#DC2626',      // Attention Crimson Red
};

export const Theme = {
  colors: Palette,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
};

export default Theme;
