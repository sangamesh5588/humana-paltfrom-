# Frontend Architecture

**Human Platform** frontends share UI components, themes, and configuration files via pnpm workspaces to achieve high design consistency and reduce visual drift.

## Client Portals
All portals are powered by **Vite**, **React**, **TypeScript**, and styled using **Vanilla CSS**.
1. **website**: Marketing Landing pages & SEO hubs.
2. **admin**: Internal management console and security dashboards.
3. **expert-portal**: Professional workspace for verified specialists to manage bookings and join conference rooms.
4. **organization-portal**: Team dashboard for companies to handle invoices and project permissions.

## Shared Packages
- **`@human-platform/theme`**: Holds design variables (custom HSL variables, spacing multipliers, typography guidelines).
- **`@human-platform/ui`**: High-fidelity, theme-compliant custom components (Buttons, Inputs, Cards, Modals).
- **`@human-platform/hooks`**: Custom React hooks (state helpers, local storage, API binding).
- **`@human-platform/api-client`**: Axios integration client configured for authorization handling and error mappings.

## Design Rules
1. **Styling**: Do not use ad-hoc Tailwind classes. Use Vanilla CSS extending variables in `theme.css`.
2. **Icons**: Use Google Fonts Icons or custom SVG files inside `@human-platform/ui`.
3. **Responsive Flow**: Every web interface must scale correctly across Mobile, Tablet, and Desktop layouts.
