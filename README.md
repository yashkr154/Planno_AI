# PlanoAI — Your AI-Powered Event Planning Partner

> **Tagline:** *"Your Vision. Our Intelligence. Perfectly Planned."*  
> **Alternative Tagline:** *"Dream It. Plan It. Celebrate It."*

PlanoAI is a modern Generative AI-powered event orchestration platform inspired by Google Developer Groups, DevFest, and clean minimalist SaaS aesthetics. It unites natural-language AI planning, intelligent venue discovery, automated RSVP invitations, Google Calendar synchronization, and real-time budget tracking into a single unified application.

---

## 🌟 Key Features

1. **Interactive 3D Hero Experience**
   - Built with Three.js rendering floating celebration rings, golden core gift octahedrons, Google DevFest spheres, invitations, and animated location pins with mouse-following parallax.
   
2. **AI Event Creation Wizard**
   - Natural language prompt intake (e.g. *"Organize an outdoor Gujarati royal wedding in Vadodara for 300 guests with ₹25,00,000 budget"*).
   - Generates structured event themes, catering menus, decoration concepts, day-of chronological schedules, itemized budget breakdowns, and prioritized task checklists.
   - Powered by Google Gemini API with intelligent heuristic failover.

3. **Smart Venue Discovery & AI Ranking**
   - Curated & verified venues in Vadodara and Ahmedabad (including Laxmi Vilas Palace, Science City Convention Center, Grand Mercure Surya Palace, and Skyline Terrace).
   - AI smart matching based on event guest capacity and target budget.
   - List and interactive Google Map viewport views with amenities tags and direction deep-links.

4. **Automated Invitations & RSVP Pipeline**
   - Customizable branded responsive invitation templates (Google Vibrant, Royal Heritage Gold, Minimalist Monochrome, Cyber Neon).
   - Personalized attendee RSVP tokens and fast check-in QR codes.
   - Bulk email dispatch workflow with anti-spam and opt-out compliance.

5. **Finance & Budget Dashboard**
   - Real-time calculations: Total Budget, Estimated Cost, Actual Incurred, Disbursed, Outstanding Due, and Remaining Buffer.
   - Category distribution Donut Chart & comparative Bar Charts using Recharts.
   - Automatic 90% budget threshold alerts.
   - Single-click CSV ledger export for accounting.

6. **Google Calendar Sync & Task Manager**
   - OAuth 2.0 synchronization workflow to sync event dates and milestone deadlines.
   - Chronological list and calendar tracking.

7. **Theme System**
   - Google Clean Light Mode & Deep Navy Obsidian Dark Mode.
   - Instant toggle with smooth transitions and persistent local storage.

8. **Enterprise Security & Database Architecture**
   - Complete PostgreSQL migration schema provided in `supabase/migrations/20260215000000_plannoai_schema.sql` with Row Level Security (RLS) policies for user data isolation.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in the configuration keys as needed:
- `VITE_GEMINI_API_KEY`: Google Gemini API key (optional; system includes high-fidelity fallback).
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Supabase project credentials (optional; local storage mode active by default).
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID for Calendar integration.

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
plannoAI/
├── public/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── Hero3DScene.tsx           # Three.js 3D Hero scene
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx       # Collapsible SaaS workspace sidebar & topbar
│   │   └── navigation/
│   │       ├── Navbar.tsx                # Sticky navbar with Theme toggle & Auth menu
│   │       └── Footer.tsx                # DevFest-inspired footer & newsletter CTA
│   ├── contexts/
│   │   ├── AuthContext.tsx               # Supabase Auth + local Demo state
│   │   ├── EventContext.tsx              # Events, tasks, expenses, guests, venues state
│   │   └── ThemeContext.tsx              # Light / Dark mode persistence
│   ├── lib/
│   │   ├── demoData.ts                   # Realistic DevFest Gujarat & Royal Wedding demo records
│   │   ├── supabase.ts                   # Supabase client initializer
│   │   └── utils.ts                      # Currency formatting & class merge helpers
│   ├── pages/
│   │   ├── HomePage.tsx                  # Landing page with 3D scene, categories, gallery, contact
│   │   ├── LoginPage.tsx                 # Login with demo quick-launch
│   │   ├── SignupPage.tsx                # Registration with terms confirmation
│   │   ├── DashboardOverviewPage.tsx     # Command center overview & vital metrics
│   │   ├── AIPlannerPage.tsx             # Interactive generative AI planner wizard
│   │   ├── EventsPage.tsx                # Multi-event management portfolio
│   │   ├── VenueFinderPage.tsx           # Location search & AI ranking
│   │   ├── GuestManagementPage.tsx       # Attendee list, CSV import & QR tokens
│   │   ├── InvitationPage.tsx            # Branded email templates & dispatch preview
│   │   ├── FinancePage.tsx               # Recharts visual analytics & CSV export
│   │   ├── CalendarPage.tsx              # Google Calendar OAuth & milestone sync
│   │   ├── VendorsPage.tsx               # Vendor directory & quotation tracker
│   │   ├── GalleryPage.tsx               # Photo album & lightbox
│   │   └── SettingsPage.tsx              # Profile, currencies, and JSON data export
│   ├── services/
│   │   └── aiService.ts                  # Google Gemini API & dynamic heuristic generator
│   ├── types/
│   │   └── index.ts                      # TypeScript data contracts & models
│   ├── App.tsx                           # React Router v7 routes & protected guards
│   ├── main.tsx
│   └── index.css                         # Tailwind CSS & Google gradient accents
├── supabase/
│   └── migrations/
│       └── 20260215000000_plannoai_schema.sql # PostgreSQL DDL with Row Level Security
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🛡️ Database & Security Specifications

The database schema (`supabase/migrations/20260215000000_plannoai_schema.sql`) implements strict Row Level Security (RLS) across all primary entities:
- `profiles`: Isolated user accounts and preferences.
- `events`: Organizers only have access to events matching their `auth.uid()`.
- `event_tasks`, `expenses`, `guests`, `invitations`, `vendors`: Sub-tables enforce relational integrity and inherit ownership permissions from parent events.
- Sensitive API keys are isolated server-side or via environment variables.

---

## 🎨 Brand Identity & Theme Palette

- **Google Blue:** `#4285F4`
- **Google Red:** `#EA4335`
- **Google Yellow:** `#FBBC05`
- **Google Green:** `#34A853`
- **Deep Navy:** `#101522`
- **Charcoal:** `#171A23`
- **Soft White:** `#F8FAFC`
- **Muted Gray:** `#94A3B8`

---

*PlanoAI: Plan Smarter. Celebrate Better.*
