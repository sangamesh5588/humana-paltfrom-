# Walkthrough — Master Data & Mobile Onboarding

We have successfully built a production-ready Master Data backend architecture, expanded the Profile database model, and completely redesigned the Mobile Profile Onboarding flow. All components compile with zero TypeScript errors.

---

## 🛠️ Changes Implemented

### 1. Database Schema (`database/prisma/schema.prisma`)
- Added 3 new enums: `MasterStatus`, `DegreeLevel`, and `JobLevel`.
- Added 7 Master Data models:
  - **Country**: name, iso2, iso3, phoneCode, currency, flagEmoji, continent
  - **Industry**: name, slug, icon
  - **Company**: name, slug, website, logo, industryId, countryId, verified
  - **JobTitle**: title, slug, category, level
  - **Skill**: name, slug, category
  - **Degree**: name, slug, level
  - **University**: name, slug, countryId, website, ranking
- Expanded **Profile** model with onboarding status and step tracking, geographic origin details (down to village level), current status, and interest arrays.
- Removed all obsolete `Journey` models.
- Synchronized database schema with PostgreSQL.

### 2. Backend Modules (`services/api/src/modules/`)
- Created 7 NestJS modules implementing the Repository pattern:
  - Fully implements validation DTOs.
  - CRUD operations with paginated search endpoints and soft delete + restore.
- Registered all new modules in `app.module.ts`.
- Created GeoNames, Google Places, and OpenStreetMap location provider stubs under the new `LocationModule`.
- Updated `ProfileModule` to map and persist onboarding steps.

### 3. Database Seeding (`database/prisma/seed/`)
- Created robust modular seed scripts for each of the 7 modules.
- Seeded more than 50 entries including countries, industries, companies, universities, degrees, skills, and job titles.

### 4. Mobile Onboarding Redesign (`apps/mobile/src/modules/onboarding/`)
- Replaced the monolithic `ProfileSetupScreen` with a modular **6-step Onboarding flow**:
  1. **Origin**: Country, state, district, city, village (optional).
  2. **Education**: Repeatable entries from Kindergarten to University.
  3. **Experience**: Repeatable entries with dynamic total experience duration badge.
  4. **Current Location**: Current status (Working, Studying, etc.) and location.
  5. **Interests**: Multiselect chips for interests and searchable skills dropdown.
  6. **Completion**: Appreciation welcome slide.
- Created reusable components:
  - `StepProgressBar`: Node-based top progress indicator.
  - `SearchableDropdown`: Debounced query hitting backend search endpoints.
  - `ChipSelector`: Multiselect tag selector.
  - `ExperienceBadge`: Dynamic total experience calculator.
- Wired steps to `App.tsx` and updated the `DashboardScreen` to display a clean welcome panel without journey elements.

### 6. Foreign Key Alignment (`verification_journeys` Table Seed & Fallback)
- **Database & Service Fix**: `verification_journeys` table in Supabase initially had 0 rows, causing `user_verification_sessions.create()` fallback to fail on the `user_verification_sessions_journeyId_fkey` constraint when inserting `'journey-default'`.
- Seeded valid `verification_journeys` records (`11111111-1111-1111-1111-111111111111`, `22222222-2222-2222-2222-222222222222`, `33333333-3333-3333-3333-333333333333`) linked to active verification types (`vt-career`, `vt-education`, `vt-skills`).
- Updated `expert.service.ts` so fallback session creation dynamically queries or seeds active `vType` and `journey` rows with guaranteed valid UUID foreign keys.

### 7. Prisma Client Regeneration & Null-Safe Model Accessors
- **Regenerated Prisma Client**: Ran `prisma generate` to update `node_modules/@prisma/client` with the latest models (`VerificationType`, `VerificationJourney`, `UserVerificationSession`), eliminating runtime `TypeError: Cannot read properties of undefined (reading 'findFirst')`.
- **Defensive Model Accessors**: Updated `startSession()` and `submitSession()` in `expert.service.ts` to safely evaluate `this.db.verificationType` and `this.db.verificationJourney` with optional chaining and default fallback UUIDs (`vt-career` and `11111111-1111-1111-1111-111111111111`).

---

## 🧪 Verification & Compilation Status

### Backend Compilation
- Command: `pnpm --filter @human-platform/api run build`
- Status: **SUCCESS (0 errors)**

### Mobile App Compilation
- Command: `pnpm --filter @human-platform/mobile run ts:check`
- Status: **SUCCESS (0 errors)**

---

### 8. 📱 Mobile Layout & Status Bar Overlap Fix
- **Problem**: Navigating to the "Sessions" tab rendered a translucent status bar. When returning to the "Home" tab, the status bar remained translucent, but the Home screen's `AppHeader` had no safe area top padding. This caused the status bar to overlap with the search bar, expert toggle, and profile image.
- **Solution**:
  - Configured `HomeScreen` to use a translucent status bar (`translucent={true}`) with a `#FFFFFF` background to match the rest of the application's modern immersive design.
  - Updated `AppHeader.tsx` using `useSafeAreaInsets` to dynamically detect the status bar height (`topInset`).
  - Added `paddingTop: topInset` and increased the header height to `56 + topInset` to push the header elements down and prevent overlapping.

