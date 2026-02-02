

# Plan: Separate Admin Panel to New Page

## Overview
Move the Admin Panel from the main Index page to a dedicated `/admin` route, while maintaining shared state between pages so admin settings continue to affect the gold price calculations on the dashboard.

## Architecture Approach

The main challenge is that the `useGoldPrices` hook manages both the price calculations AND admin settings. We need to ensure both pages can access and modify the same settings. 

**Solution**: Create a React Context to share the gold prices state across routes, so settings changed on the Admin page immediately affect the Dashboard.

```text
┌─────────────────────────────────────────────────────────┐
│                         App.tsx                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │           GoldPricesProvider (Context)            │  │
│  │                                                   │  │
│  │   ┌─────────────────┐   ┌────────────────────┐   │  │
│  │   │  / (Dashboard)  │   │  /admin (Admin)    │   │  │
│  │   │                 │   │                    │   │  │
│  │   │  - Price Cards  │   │  - API Tab         │   │  │
│  │   │  - Market Rates │   │  - Prices Tab      │   │  │
│  │   │  - Making       │   │  - Charges Tab     │   │  │
│  │   │    Charges      │   │  - Security Tab    │   │  │
│  │   │                 │   │                    │   │  │
│  │   │  [Admin Link]   │   │  [Back to Home]    │   │  │
│  │   └─────────────────┘   └────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create Gold Prices Context
**File**: `src/contexts/GoldPricesContext.tsx`

Create a React Context that wraps the existing `useGoldPrices` hook logic:
- Export a `GoldPricesProvider` component
- Export a `useGoldPricesContext` hook for consuming the context
- Move all state and calculation logic from the hook into the provider

### Step 2: Create Admin Page
**File**: `src/pages/Admin.tsx`

Create a new page component that:
- Imports the shared Header component
- Uses `useGoldPricesContext` to access admin settings
- Renders the AdminPanel component
- Includes a "Back to Dashboard" navigation link

### Step 3: Update App.tsx Routing
**File**: `src/App.tsx`

- Wrap the router with `GoldPricesProvider`
- Add new route: `/admin` pointing to the Admin page
- Routes will be:
  - `/` - Dashboard (Index page)
  - `/admin` - Admin Panel

### Step 4: Update Index Page
**File**: `src/pages/Index.tsx`

- Remove the AdminPanel import and component
- Use `useGoldPricesContext` instead of `useGoldPrices` hook
- Add a link/button to navigate to `/admin` (gear icon or "Admin" button)

### Step 5: Update Header Component
**File**: `src/components/Header.tsx`

Add navigation elements:
- On Dashboard: Add Settings/Admin icon that links to `/admin`
- On Admin page: Add a "Back to Home" link

### Step 6: Refactor useGoldPrices Hook
**File**: `src/hooks/useGoldPrices.ts`

Keep the hook but make it consume the context internally, so existing code patterns remain compatible. Alternatively, remove the hook and have components use the context directly.

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/contexts/GoldPricesContext.tsx` | Shared state provider for gold prices and admin settings |
| `src/pages/Admin.tsx` | Dedicated admin page |

### Files to Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Add GoldPricesProvider wrapper and `/admin` route |
| `src/pages/Index.tsx` | Remove AdminPanel, add navigation to admin, use context |
| `src/components/Header.tsx` | Add settings icon for navigation |
| `src/hooks/useGoldPrices.ts` | Refactor to use or export context-compatible logic |

### Navigation Flow
- Dashboard shows a settings/gear icon in the header
- Clicking the icon navigates to `/admin`
- Admin page has a "Back to Dashboard" button
- All settings persist via localStorage (existing behavior)
- Changes in admin immediately reflect on dashboard (context-shared state)

