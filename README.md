HubMovies — Global Casting Marketplace
UI Prototype v0.1 | Live Demo | Production-grade cinematic interface

🌟 Project Vision
HubMovies exists to remove friction, opacity, and gatekeeping from global casting — replacing fragmented networks with a single, cinematic marketplace built for creatives. This UI prototype establishes the foundation for a premium, art-directed digital experience that feels intentional and human—not algorithmic.

Current Phase: Production-grade full-stack application with MongoDB database integration, NextAuth.js authentication, admin panel, and comprehensive trust/verification system. Payments and advanced features coming next.

🎬 Cinematic Aesthetic Rules
This project follows strict design principles to avoid "AI slop" and maintain artistic integrity.

Typography Rules
Primary Fonts: DM Sans (body) + Libre Baskerville (headings)

Philosophy: Bold, expressive, humanist typography defines the aesthetic

Avoid: Generic/system fonts (Inter, Roboto, Arial, Space Grotesk)

Approach: Editorial sensibility with character-rich typefaces

Color & Theme
Base: Dark cinematic (#0b0b0c)

Accents: Gold (#c7a24b), Red (#8f1d18)

Text: Primary (#f4f4f5), Secondary (#b5b5b7)

Rule: High-contrast dominant colors with selective accents

Avoid: Cliché AI palettes, overused gradients (purple→blue)

Motion & Interaction
Library: Framer Motion for React components

Philosophy: Purposeful animation only—no scattered or "sloppy" motions

Patterns:

Staggered reveal on page load

Fade-in + scale for hero elements

Subtle hover effects

Moving sheen across hero section

Avoid: Random or generic CSS animations

Background & Atmosphere
Base: Layered radial gradients + CSS procedural noise (no external files)

Hero: Pexels cinematic image + animated sheen overlay

Video: Deferred until user onboarding (Coverr for future motion headers)

Goal: Depth, ambiance, and identity through layered textures

Avoid: Flat solid-color backgrounds, placeholder/lorem ipsum text

🛠 Tech Stack
Core Framework

Next.js 16 (App Router)

TypeScript

Tailwind CSS

UI & Components

shadcn/ui for accessible components

Framer Motion for animations

Custom cinematic components

State & Validation

Zustand (auth, role, access level, verification, payments)

Zod for form validation

Media Sources

Portraits: Unsplash

Cinematic backgrounds: Pexels

Motion headers: Coverr (future)

Data

JSON / in-memory mocked state

Realistic global dataset

✅ Implemented Features
Global Foundation
✅ Typography system locked (DM Sans + Libre Baskerville)

✅ Global CSS procedural noise background

✅ Cinematic sheen animation system

✅ Responsive, dark-first design system

✅ Tailwind design tokens established

✅ SessionProvider wrapper for NextAuth.js

Header / Navigation
✅ Fixed transparent cinematic header with backdrop blur

✅ Smooth fade-down animation on page load

✅ Logo with gold accent

✅ Navigation: Jobs, Talents, How It Works, Pricing

✅ Action buttons: Sign In, Get Started

✅ Notification bell with unread count badge

✅ Fully responsive (hamburger menu on mobile)

Hero Section
✅ Full-screen cinematic landing

✅ Motion layers: image fade + scale, moving sheen

✅ Dark overlay for readability

✅ Animated title + subtitle with staggered reveal

✅ CTA buttons with hover effects

✅ No missing assets (pure CSS solutions)

Sources: Pexels (image), CSS (sheen)

Authentication & Authorization
✅ NextAuth.js integration with MongoDB adapter

✅ Email/password authentication

✅ Email verification system (3-layer enforcement)

✅ Password reset flow

✅ Session management with JWT strategy (optimized for CredentialsProvider)

✅ Role-based access control (TALENT, DIRECTOR)

✅ Middleware-based route protection

✅ Email verification enforcement (session, middleware, API, UI)

Payment System (NEW)
✅ Settings model for storing payment addresses (ETH, BTC)

✅ Admin API to set/update payment addresses (`POST /api/admin/payment`)

✅ Payment confirmation API to unlock users (`POST /api/admin/users/[id]/confirm-payment`)

✅ User payment fields: paymentConfirmed, paymentMethod, paymentReference, paymentAt

✅ Admin payments UI (`/admin/payments`) to manage addresses and confirm payments

✅ Awaiting payment list for admin review (`GET /api/admin/users/awaiting-payment`)

✅ Payment confirmation unfreezes user account and creates audit log

Profile Management
✅ Talent profile editing with image upload

✅ Profile completion calculation (automatic)

✅ Talent verification tiers (BASIC, COMPLETE, VERIFIED, FEATURED)

✅ Director trust score system

✅ Profile completion enforcement (blocks applications if incomplete)

✅ Cloudinary integration for media uploads

Director Trust System
✅ Trust score tracking (0-100)

✅ Trust levels: NEW_DIRECTOR, TRUSTED_DIRECTOR, VERIFIED_STUDIO

✅ Trust-based capabilities (job limits, bulk actions, visibility)

✅ Trust score increments based on actions

✅ Director-facing trust panel with improvement suggestions

✅ Talent-facing trust badges and messaging

Job Management
✅ Public job listings with director trust badges

✅ Job creation with trust-based limits

✅ Job editing functionality

✅ Job visibility weighted by director trust

✅ Job sorting by trust score and deadline

✅ Applied status tracking

Application System
✅ Multi-step application flow

✅ Media upload (images/videos) to Cloudinary

✅ Application status tracking (submitted, shortlisted, rejected)

✅ Duplicate application prevention

✅ Director application management dashboard

✅ Bulk application status updates (trust-based)

✅ Application detail modals

Messaging System
✅ Director-to-talent messaging

✅ Message threads grouped by application

✅ In-app notifications for new messages

✅ Message history viewing

✅ Talent message viewing (read-only, replies deferred)

Notifications
✅ In-app notification system

✅ Notification bell with unread count

✅ Notification dropdown with mark-as-read functionality

✅ Email notifications for application status changes

✅ Notification types: message, application_status, job_posted, system

Pages & Routes
✅ Landing page with hero section

✅ Jobs listing page

✅ Talents directory page

✅ How It Works page

✅ Pricing page

✅ Talent dashboard with applications

✅ Director dashboard with jobs and applications

✅ Talent profile editing page

✅ Director messages page

✅ Authentication pages (login, signup, verify, reset password)
- ✅ Password login with visibility toggle
- ✅ Signup page with role selection
- ✅ Admin user setup page

Role System & Data
✅ User roles: TALENT, DIRECTOR

✅ Talent verification tiers: BASIC, COMPLETE, VERIFIED, FEATURED

✅ Director trust levels: NEW_DIRECTOR, TRUSTED_DIRECTOR, VERIFIED_STUDIO

✅ MongoDB database integration

✅ Real-time data fetching and updates

✅ Global marketplace (no region lock)

📁 Architecture & Structure
```
hubmovies-cast/
├─ web/                          # Next.js application root
│  ├─ app/                       # Next.js App Router directory
│  │  ├─ admin/
│  │  │  ├─ page.tsx             # Admin dashboard (redirects to jobs)
│  │  │  ├─ jobs/
│  │  │  │  └─ page.tsx          # Admin job management
│  │  │  │     └─ [id]/
│  │  │  │        └─ applications/
│  │  │  │           └─ page.tsx # Admin view job applications
│  │  │  ├─ payments/
│  │  │  │  └─ page.tsx          # Admin payment settings & confirmation UI
│  │  │  ├─ setup/
│  │  │  │  └─ page.tsx          # Admin initial setup page
│  │  │  └─ trust/
│  │  │     ├─ director/
│  │  │     │  └─ [id]/
│  │  │     │     └─ page.tsx    # Admin director trust management
│  │  │     └─ talent/
│  │  │        └─ [id]/
│  │  │           └─ page.tsx    # Admin talent verification tier management
│  │  ├─ api/                    # API routes
│  │  │  ├─ admin/
│  │  │  │  ├─ jobs/
│  │  │  │  │  ├─ route.ts       # GET/POST admin job management
│  │  │  │  │  └─ [id]/
│  │  │  │  │     ├─ actions/
│  │  │  │  │     │  └─ route.ts # PATCH job actions (hide, close early)
│  │  │  │  │     └─ applications/
│  │  │  │  │        └─ route.ts # GET job applications for admin
│  │  │  │  ├─ payment/
│  │  │  │  │  └─ route.ts       # GET/POST admin payment addresses (ETH/BTC)
│  │  │  │  ├─ restrictions/
│  │  │  │  │  ├─ director/
│  │  │  │  │  │  └─ [id]/
│  │  │  │  │  │     └─ route.ts # Admin talent restrictions
│  │  │  │  │  └─ talent/
│  │  │  │  │     └─ [id]/
│  │  │  │  │        └─ route.ts # Admin talent restrictions
│  │  │  │  ├─ setup/
│  │  │  │  │  └─ route.ts       # Admin setup endpoint
│  │  │  │  ├─ trust/
│  │  │  │  │  ├─ director/
│  │  │  │  │  │  └─ [id]/
│  │  │  │  │  │     └─ route.ts # Admin director trust management
│  │  │  │  │  ├─ talent/
│  │  │  │  │  │  └─ [id]/
│  │  │  │  │  │     └─ route.ts # Admin talent verification tiers
│  │  │  │  │  └─ override/
│  │  │  │  │     └─ route.ts    # Admin trust score override
│  │  │  │  └─ users/
│  │  │  │     ├─ awaiting-payment/
│  │  │  │     │  └─ route.ts    # GET list of users awaiting payment confirmation
│  │  │  │     └─ [id]/
│  │  │  │        ├─ confirm-payment/
│  │  │  │        │  └─ route.ts # POST confirm user payment & unlock account
│  │  │  │        ├─ freeze/
│  │  │  │        │  └─ route.ts # POST freeze user account
│  │  │  │        ├─ unfreeze/
│  │  │  │        │  └─ route.ts # POST unfreeze user account
│  │  │  │        ├─ profile/
│  │  │  │        │  └─ route.ts # GET/PATCH admin user profile
│  │  │  │        └─ restrictions/
│  │  │  │           └─ route.ts # GET/PATCH user restrictions
│  │  │  ├─ apply/
│  │  │  │  ├─ route.ts          # POST endpoint for job applications
│  │  │  │  └─ status/
│  │  │  │     └─ route.ts       # GET endpoint to check applied status
│  │  │  ├─ auth/
│  │  │  │  ├─ [...nextauth]/
│  │  │  │  │  └─ route.ts       # NextAuth.js authentication
│  │  │  │  ├─ complete/
│  │  │  │  │  └─ route.ts       # Complete signup flow
│  │  │  │  ├─ forgot-password/
│  │  │  │  │  └─ route.ts       # Password reset request
│  │  │  │  ├─ resend-verification/
│  │  │  │  │  └─ route.ts       # Resend email verification
│  │  │  │  └─ reset-password/
│  │  │  │     └─ route.ts       # Password reset handler
│  │  │  ├─ director/
│  │  │  │  ├─ applications/
│  │  │  │  │  ├─ route.ts       # GET director applications
│  │  │  │  │  ├─ [id]/
│  │  │  │  │  │  └─ route.ts    # PATCH update application status
│  │  │  │  │  └─ bulk/
│  │  │  │  │     └─ route.ts    # Bulk update applications
│  │  │  │  ├─ jobs/
│  │  │  │  │  ├─ route.ts       # GET/POST director jobs
│  │  │  │  │  └─ [id]/
│  │  │  │  │     └─ route.ts    # PATCH/DELETE job
│  │  │  │  ├─ messages/
│  │  │  │  │  ├─ route.ts       # POST send message
│  │  │  │  │  └─ threads/
│  │  │  │  │     └─ route.ts    # GET message threads
│  │  │  │  └─ profile/
│  │  │  │     └─ route.ts       # GET director profile/trust
│  │  │  ├─ jobs/
│  │  │  │  └─ route.ts          # GET public job listings
│  │  │  ├─ messages/
│  │  │  │  └─ route.ts          # GET messages (universal)
│  │  │  ├─ notifications/
│  │  │  │  ├─ route.ts          # GET/PATCH notifications
│  │  │  │  └─ unread-count/
│  │  │  │     └─ route.ts       # GET unread count
│  │  │  ├─ talent/
│  │  │  │  ├─ applications/
│  │  │  │  │  └─ route.ts        # GET talent applications
│  │  │  │  ├─ messages/
│  │  │  │  │  └─ route.ts       # GET talent messages
│  │  │  │  └─ profile/
│  │  │  │     ├─ route.ts       # GET/PATCH talent profile
│  │  │  │     └─ completion/
│  │  │  │        └─ route.ts     # GET profile completion
│  │  │  └─ upload/
│  │  │     └─ route.ts          # POST file upload to Cloudinary
│  │  ├─ auth/                    # Authentication pages
│  │  │  ├─ page.tsx             # Auth landing page
│  │  │  ├─ check-email/
│  │  │  │  └─ page.tsx          # Email check page
│  │  │  ├─ complete/
│  │  │  │  └─ page.tsx          # Complete signup page
│  │  │  ├─ email/
│  │  │  │  └─ page.tsx          # Email login page
│  │  │  ├─ error/
│  │  │  │  └─ page.tsx          # Auth error page
│  │  │  ├─ forgot-password/
│  │  │  │  └─ page.tsx          # Forgot password page
│  │  │  ├─ password/
│  │  │  │  └─ page.tsx          # Password login page
│  │  │  ├─ reset-password/
│  │  │  │  └─ [token]/
│  │  │  │     └─ page.tsx       # Reset password page
│  │  │  └─ verify-email/
│  │  │     └─ page.tsx          # Email verification page
│  │  ├─ components/             # React components
│  │  │  ├─ casting-director-verification-modal.tsx
│  │  │  ├─ create-casting-modal/
│  │  │  │  ├─ create-casting-modal.tsx
│  │  │  │  └─ step-basic.tsx
│  │  │  ├─ director/
│  │  │  │  └─ dashboard/
│  │  │  │     ├─ components/
│  │  │  │     │  ├─ application-row.tsx
│  │  │  │     │  ├─ applications-panel.tsx
│  │  │  │     │  ├─ director-stats.tsx
│  │  │  │     │  ├─ director-trust-panel.tsx
│  │  │  │     │  ├─ job-card.tsx
│  │  │  │     │  └─ job-list.tsx
│  │  │  │     ├─ modals/
│  │  │  │     │  ├─ create-job-modal.tsx
│  │  │  │     │  ├─ edit-job-modal.tsx
│  │  │  │     │  ├─ manage-applicants-modal.tsx
│  │  │  │     │  └─ message-modal.tsx
│  │  │  │     └─ page.tsx       # Director dashboard
│  │  │  ├─ header.tsx           # Fixed cinematic navigation
│  │  │  ├─ hero.tsx             # Full-screen cinematic hero
│  │  │  ├─ job-detail-modal.tsx # Job details modal
│  │  │  ├─ jobs-preview.tsx     # Jobs grid preview
│  │  │  ├─ modals/
│  │  │  │  ├─ apply-flow-modal.tsx  # Multi-step application flow
│  │  │  │  └─ modal-shell.tsx       # Reusable modal wrapper
│  │  │  ├─ notifications/
│  │  │  │  ├─ notification-bell.tsx   # Notification bell icon
│  │  │  │  └─ notification-dropdown.tsx  # Notification dropdown
│  │  │  ├─ talent/
│  │  │  │  └─ messages-view.tsx
│  │  │  ├─ talent-profile-modal.tsx # Talent profile modal
│  │  │  ├─ talents-preview.tsx      # Talents grid preview
│  │  │  └─ verification-upgrade-modal.tsx
│  │  ├─ director/
│  │  │  └─ messages/
│  │  │     └─ page.tsx          # Director messages page
│  │  ├─ how-it-works/
│  │  │  └─ page.tsx            # How It Works page
│  │  ├─ jobs/
│  │  │  └─ page.tsx            # Jobs listing page
│  │  ├─ pricing/
│  │  │  └─ page.tsx            # Pricing page
│  │  ├─ talent/
│  │  │  ├─ dashboard/
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ application-detail-modal.tsx
│  │  │  │  │  └─ message-thread-modal.tsx
│  │  │  │  └─ page.tsx         # Talent dashboard
│  │  │  └─ profile/
│  │  │     └─ page.tsx         # Talent profile page
│  │  ├─ talents/
│  │  │  └─ page.tsx            # Talents directory page
│  │  ├─ favicon.ico
│  │  ├─ globals.css             # Theme, noise, sheen, typography
│  │  ├─ layout.tsx              # Root layout with SessionProvider
│  │  ├─ page.tsx                # Landing page
│  │  └─ providers.tsx           # SessionProvider wrapper
│  ├─ lib/                       # Utility libraries
│  │  ├─ admin-helpers.ts        # Admin authentication & authorization utilities
│  │  ├─ auth-adapter.ts         # NextAuth Mongoose adapter
│  │  ├─ auth-helpers.ts         # Auth utility functions
│  │  ├─ cloudinary.ts           # Cloudinary media upload client
│  │  ├─ director-trust.ts       # Director trust system logic
│  │  ├─ email.ts                # Email sending utilities
│  │  ├─ mongodb.ts              # MongoDB connection handler
│  │  └─ profile-completion.ts   # Profile completion calculation
│  ├─ models/                    # Database models
│  │  ├─ application.ts          # Application schema/model
│  │  ├─ audit-log.ts            # Audit log schema for admin actions
│  │  ├─ job.ts                  # Job posting schema
│  │  ├─ message.ts              # Message schema
│  │  ├─ notification.ts         # Notification schema
│  │  ├─ session.ts             # NextAuth session schema
│  │  ├─ settings.ts            # Settings schema (payment addresses)
│  │  ├─ user.ts                 # User schema (updated with payment fields)
│  │  └─ verification-token.ts   # Email verification token schema
│  ├─ public/                    # Static assets
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ noise.png
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ types/
│  │  └─ next-auth.d.ts         # NextAuth type definitions
│  ├─ eslint.config.mjs          # ESLint configuration
│  ├─ middleware.ts              # Next.js middleware (auth, verification)
│  ├─ next.config.ts             # Next.js configuration
│  ├─ next-env.d.ts              # Next.js TypeScript definitions
│  ├─ package.json               # Dependencies and scripts
│  ├─ postcss.config.mjs         # PostCSS configuration
│  ├─ README.md                  # Project documentation
│  └─ tsconfig.json              # TypeScript configuration
```
Global Styles (app/globals.css) includes:

Dark cinematic theme variables

Procedural noise background

Moving sheen animations

Typography scale (clamp() for responsiveness)

Global overflow-x: hidden

🚀 Development
Local Setup
bash
pnpm install
pnpm dev
Deployment
Built on Next.js 16

Compatible with Vercel, Netlify, etc.

Fonts imported in RootLayout.tsx

🔮 AI Continuation Guide
CRITICAL: All future development MUST respect these rules:

Design Continuity
Always reference <frontend_aesthetics> principles

Typography: Never revert to system fonts

Color: Maintain dark-cinematic base with gold/red accents

Motion: Use Framer Motion purposefully, avoid random animations

Background: Keep noise texture + sheen animations consistent

Media Sources
Portraits → Unsplash

Cinematic shots → Pexels

Motion headers → Coverr (defer video until onboarding)

Never use placeholder images or lorem ipsum

Component Rules
All buttons/CTAs trigger modals or mocked flows

Hero remains full-screen + animated until user onboarding

Maintain fixed cinematic header across all pages

Use global design tokens (CSS variables)

Page Creation Guide
When building new pages (Jobs, Talents, Pricing, How It Works, Auth, Dashboards):

Import global styles

Use established typography system

Apply cinematic color palette

Include purposeful motion

Mock backend flows with Zustand + JSON state

Ensure mobile → desktop responsiveness

Maintain hero/header consistency

State Management Pattern
typescript
// Zustand store structure
auth: { loggedIn: boolean }
role: Role
accessLevel: AccessLevel
verification: { status: boolean }
payments: { status: string }
Form Validation
Signup, Login (Zod schemas)

Post Job, Apply Job

Profile Edit, Contact forms

Always validate with Zod before mock submission

🎥 Media Attribution
All media is sourced from free platforms:

Pexels - Cinematic background images

Unsplash - Portrait photography

Coverr - Future motion video headers

Implementation Notes:

Noise background is pure CSS (no external file)

Hero video deferred—currently using animated sheen

All typography, motion, and color principles are locked

📝 Next Development Phase
Priority Pages to Build:

Jobs Listing & Detail

Talents Directory & Profiles

Pricing Plans

How It Works

Authentication Flows

Role-based Dashboards

Each must follow:

Cinematic aesthetic rules

Established component patterns

Mocked data flows

Responsive requirements

⚡ Performance Notes
CSS-based solutions preferred over external assets

Images optimized at source

Motion deferred where possible

Modular component architecture

Maintained with artistic intent. This interface rejects generic AI patterns in favor of human-directed cinematic design. Every element serves the narrative of connecting creative professionals in a global marketplace.

### Image Handling Rules

- Editorial UI sections (Hero, Talents, Jobs):
  → Use standard `<img>` tags for flexibility and portability

- Dashboard & authenticated areas:
  → Use `next/image` with configured CDNs

Reason:
Cinematic layouts prioritize visual freedom over aggressive optimization.
### Talent Profile Preview Modal

- Opens from Talents Preview cards
- Framer Motion animated entrance
- Editorial two-column layout
- Verification-gated content
- No route change (modal-based UX)

Purpose:
Reinforces premium access while preserving cinematic immersion.
Recommended changes (later)

Replace "TEMP_TALENT_ID" with the logged-in user ID.

Add proper validation and error handling.

Integrate job applied state (so “Apply” button changes to “Applied”).

Add dashboard & notifications for casting directors.

README (Current Implementation + Recommendations)
Implemented Features

Job & Talent Preview

Job cards clickable → show details in modal (JobDetailModal).

Talent grid preview with modals for profiles (TalentsPreview, TalentProfileModal).

ApplyFlowModal

Multi-step modal: confirm profile → upload media → answer question → review → success.

Connected to /api/apply route.

Media uploaded to Cloudinary.

Application saved to MongoDB (Application model).

MongoDB Integration

lib/mongodb.ts handles connection caching.

models/application.ts defines application schema with status.

Apply API

/api/apply POST route.

Accepts jobId, answer, media.

Uploads media to Cloudinary and stores in MongoDB.

Recommended Changes (Future)

✅ **COMPLETED:**
- Store actual talentId from logged-in user (replaced TEMP_TALENT_ID)
- Add validation for media type & size (MP4, JPEG/PNG with size limits)

**REMAINING:**
- Show real-time "Applied" state on job cards.

Jobs

Link Job cards → ApplyFlowModal modal.

Casting Director

Dashboard to review applications.

Status updates: submitted, shortlisted, rejected.

Notifications via email/in-app.

File structure

Keep lib/ & models/ inside app/ for Next.js 13+ (or web/ depending on your structure).

UI

Animate transitions, improve mobile responsiveness.

Use Framer Motion for smooth step transitions.

---

## 📝 Recent Changes & Updates

### Latest Update: Admin UI Enhancements - Bulk Payments, Pagination & History

**Date:** January 29, 2026

**Major Changes Made:**

1. **Bulk Payment Confirmation**
   - ✅ Added bulk selection checkboxes to `/admin/payments` page
   - ✅ "Select all on page" checkbox for quick bulk selection
   - ✅ Bulk confirmation button with validation
   - ✅ `POST /api/admin/users/bulk-confirm-payment` endpoint
   - ✅ Confirms multiple payments with single method + reason
   - ✅ Creates individual audit logs for each user

2. **Payment History Tracking**
   - ✅ New `/admin/payments/history` page with full payment history
   - ✅ `GET /api/admin/payments/history` API endpoint
   - ✅ Filters: Payment Method (ETH/BTC), Email search, Date range
   - ✅ Pagination support (page, limit parameters)
   - ✅ Export to CSV button (downloads filtered/paginated results)
   - ✅ Table display: Email, Name, Method, Transaction Hash, Dates

3. **Pagination Enhancements**
   - ✅ Updated `/api/admin/users/awaiting-payment` with page/limit
   - ✅ Default 20 results per page, configurable via limit param
   - ✅ Pagination info: current page, total pages, total count
   - ✅ Previous/Next navigation buttons on UI

4. **Admin Payments Page Updates**
   - ✅ Bulk selection UI with checkboxes
   - ✅ "X selected" counter when items are checked
   - ✅ "Confirm Selected" button for bulk actions
   - ✅ Link to payment history page ("View History →")
   - ✅ Improved layout and status indicators

**New Files Created:**
- `app/admin/payments/history/page.tsx` - Payment history UI page with filters and export

**New API Routes Created:**
- `POST /api/admin/users/bulk-confirm-payment` - Bulk confirm payments
- `GET /api/admin/payments/history?page=1&limit=20&method=ETH&email=test&startDate=...&endDate=...` - Payment history

**Files Modified:**
- `app/admin/payments/page.tsx` - Already had bulk UI implementation
- `README.md` - Updated implementation summary and phase status

**Build Status:**
- ✅ Production build successful (58 pages, 0 TypeScript errors)
- ✅ New routes registered: `/admin/payments/history` (static), `/api/admin/payments/history` (dynamic), `/api/admin/users/bulk-confirm-payment` (dynamic)

**API Documentation:**

#### Bulk Confirm Payments
```typescript
POST /api/admin/users/bulk-confirm-payment
Content-Type: application/json

Request:
{
  userIds: string[] - Array of user IDs
  method: "ETH" | "BTC" - Payment method
  reason?: string - Optional reason for audit log
}

Response:
{
  confirmed: number,
  failed: number,
  skipped: number,
  message: string
}
```

#### Payment History
```typescript
GET /api/admin/payments/history?page=1&limit=20&method=ETH&email=user@example.com&startDate=2026-01-01&endDate=2026-01-31

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- method: "ETH" | "BTC" (optional)
- email: string (optional, partial match)
- startDate: YYYY-MM-DD (optional)
- endDate: YYYY-MM-DD (optional)

Response:
{
  users: Array<{
    _id: string
    email: string
    name?: string
    paymentMethod: "ETH" | "BTC"
    paymentReference?: string
    paymentAt: string (ISO date)
    createdAt: string (ISO date)
    auditLogs: Array<{ _id: string; reason?: string; createdAt: string }>
  }>
  pagination: { page, limit, total, pages }
  filters: { method, email, startDate, endDate }
}
```

---

### Latest Update: Admin System, Authentication Improvements, Session Fixes & Mobile Responsiveness

**Date:** Current Session

**Major Changes Made:**

1. **Admin System Implementation**
   - ✅ Complete admin panel with role-based access control
   - ✅ Admin trust override system for talents and directors
   - ✅ Job management and moderation tools
   - ✅ User profile viewing and restrictions management
   - ✅ Comprehensive audit logging for all admin actions
   - ✅ Admin dashboard at `/admin/jobs`

2. **Authentication & Session Improvements**
   - ✅ Fixed session establishment issues (switched from database to JWT strategy)
   - ✅ Improved login redirect logic with role-based routing
   - ✅ Added session loader component with retry logic
   - ✅ Admin user setup via `/admin/setup` page
   - ✅ Password visibility toggle on login page
   - ✅ Header updates to show user info when logged in

3. **User Registration & Signup**
   - ✅ Complete signup flow for talents and directors
   - ✅ Role-based signup with email verification
   - ✅ Signup page with role selection and query parameter support
   - ✅ Email setup documentation (EMAIL_SETUP.md)

4. **UI/UX Improvements**
   - ✅ Mobile-first responsive design for job cards and talent cards
   - ✅ Responsive header that doesn't cover hero section
   - ✅ Mobile-optimized navigation and user menu
   - ✅ Hero section padding to accommodate fixed header
   - ✅ Improved button states and touch targets on mobile

5. **Navigation & Routing**
   - ✅ "Explore Talent" button links to `/talents` page
   - ✅ "Post Job" button checks director login and redirects appropriately
   - ✅ Role-based dashboard routing after login
   - ✅ Admin redirect to `/admin/jobs` after login

**New API Routes Created:**

### Admin Routes
- `POST /api/admin/setup` - Create initial admin user
- `GET /api/admin/trust/talent/[id]` - Get talent trust data for admin
- `GET /api/admin/trust/director/[id]` - Get director trust data for admin
- `POST /api/admin/trust/override` - Apply trust/verification tier override
- `GET /api/admin/users/[id]/profile` - View user profile (admin read-only)
- `POST /api/admin/users/[id]/freeze` - Freeze user account
- `POST /api/admin/users/[id]/unfreeze` - Unfreeze user account
- `POST /api/admin/users/[id]/restrictions` - Apply/remove user restrictions
- `GET /api/admin/jobs` - List all jobs (including hidden) with filters
- `POST /api/admin/jobs/[id]/actions` - Admin job actions (close early, hide/unhide)
- `GET /api/admin/jobs/[id]/applications` - View applications for a job

**New Pages Created:**
- `/admin/page.tsx` - Admin dashboard redirect page
- `/admin/jobs/page.tsx` - Admin jobs management page
- `/admin/jobs/[id]/applications/page.tsx` - Admin job applications viewer
- `/admin/trust/talent/[id]/page.tsx` - Admin talent trust management
- `/admin/trust/director/[id]/page.tsx` - Admin director trust management
- `/admin/setup/page.tsx` - Admin user setup page
- `/signup/page.tsx` - User signup page with role selection
- `/director/dashboard/page.tsx` - Director dashboard route
- `/auth/password/page.tsx` - Enhanced password login page

**New Components Created:**
- `components/auth/session-loader.tsx` - Session establishment loading component
- `components/admin/trust-override-page.tsx` - Main admin trust management component
- `components/admin/trust-override-panel.tsx` - Admin action panel
- `components/admin/identity-header.tsx` - User identity display for admin

**Files Modified:**
- `app/api/auth/[...nextauth]/route.ts` - Changed session strategy from database to JWT
- `app/components/header.tsx` - Added session management and responsive design
- `app/components/hero.tsx` - Added navigation logic and padding
- `app/components/jobs-preview.tsx` - Mobile-responsive improvements
- `app/components/talents-preview.tsx` - Mobile-responsive card design
- `app/components/director/dashboard/components/job-card.tsx` - Mobile-responsive
- `middleware.ts` - Updated to allow admin setup page access
- `app/auth/password/page.tsx` - Added session loader and retry logic

**Configuration Files:**
- `.env.local` - Added NEXTAUTH_SECRET configuration
- `EMAIL_SETUP.md` - Email server setup documentation
- `ENV_SETUP.md` - Environment variables documentation

**Scripts Created:**
- `scripts/create-admin.ts` - Script to create admin user programmatically

---

### Previous Update: SessionProvider Fix, Notification System, and Missing Components

**Date:** Current Session

**Changes Made:**

1. **SessionProvider Integration**
   - ✅ Created `web/app/providers.tsx` - SessionProvider wrapper component
   - ✅ Updated `web/app/layout.tsx` to wrap app with SessionProvider
   - ✅ Fixed `useSession` error in NotificationBell component
   - ✅ All components using `useSession` now work correctly

2. **Notification System Implementation**
   - ✅ Created `web/models/notification.ts` - Notification Mongoose schema
   - ✅ Created `web/app/components/notifications/notification-dropdown.tsx` - Full notification dropdown UI
   - ✅ Created `web/app/api/notifications/unread-count/route.ts` - API endpoint for unread count
   - ✅ Updated `web/app/components/notifications/notification-bell.tsx` - Fixed useSession integration
   - ✅ Notification system fully functional with real-time updates

3. **Talent Dashboard Components**
   - ✅ Created `web/app/talent/dashboard/components/application-detail-modal.tsx` - Application detail view
   - ✅ Created `web/app/talent/dashboard/components/message-thread-modal.tsx` - Message thread viewer
   - ✅ Both modals follow cinematic design system with proper TypeScript types

4. **API Routes**
   - ✅ Created `web/app/api/talent/messages/route.ts` - Talent message fetching endpoint
   - ✅ All API routes properly handle authentication and verification

5. **Build Fixes**
   - ✅ Fixed duplicate code in `create-casting-modal.tsx`
   - ✅ Fixed TypeScript errors in modal components
   - ✅ Fixed type mismatches between components
   - ✅ All build errors resolved, production build successful

**Files Created:**
- `web/app/providers.tsx`
- `web/models/notification.ts`
- `web/app/components/notifications/notification-dropdown.tsx`
- `web/app/api/notifications/unread-count/route.ts`
- `web/app/talent/dashboard/components/application-detail-modal.tsx`
- `web/app/talent/dashboard/components/message-thread-modal.tsx`
- `web/app/api/talent/messages/route.ts`

**Files Modified:**
- `web/app/layout.tsx` - Added SessionProvider wrapper
- `web/app/components/notifications/notification-bell.tsx` - Fixed useSession usage
- `web/app/components/create-casting-modal/create-casting-modal.tsx` - Removed duplicate code

**Next Steps & Recommendations:**

1. **Notification Enhancements**
   - Add real-time notification updates via WebSocket or polling
   - Add notification preferences (email vs in-app)
   - Add notification grouping by type
   - Add "Mark all as read" functionality

2. **Talent Messaging**
   - Implement talent reply functionality (currently deferred)
   - Add message read receipts
   - Add typing indicators
   - Add file attachments to messages

3. **Performance Optimization**
   - Optimize notification polling (currently 30s interval)
   - Add notification caching
   - Batch notification updates
   - Implement virtual scrolling for long notification lists

4. **User Experience**
   - Add notification sound/desktop notifications
   - Add notification filters (by type, date)
   - Add notification search functionality
   - Improve mobile notification experience

---

### Previous Update: Email Verification & Profile Completion (Previous Session)

**Date:** Current Session

**Changes Made:**

1. **Authentication Integration**
   - ✅ Replaced `TEMP_TALENT_ID` with authenticated user ID from request cookies
   - ✅ Added `getUserId()` helper function in `/api/apply/route.ts` that reads from cookies
   - ✅ Returns 401 Unauthorized if user is not logged in
   - ✅ Supports multiple cookie name patterns (`userId`, `user_id`, `session`)

2. **Media Validation**
   - ✅ Added server-side validation in API route:
     - File types: MP4 videos, JPEG/PNG images only
     - Size limits: 50MB for videos, 10MB for images
     - Returns descriptive error messages
   - ✅ Added client-side validation in `ApplyFlowModal`:
     - Real-time validation on file selection
     - Inline error messages displayed to user
     - File input `accept` attribute restricts file picker
     - Help text showing accepted formats and limits
   - ✅ Cloudinary upload now uses correct `resource_type` (video/image) based on file type

**Files Modified:**
- `web/app/api/apply/route.ts` - Added authentication check and media validation
- `web/app/components/modals/apply-flow-modal.tsx` - Added client-side validation and error handling

**Next Steps & Recommendations:**

1. **Authentication System**
   - Implement full authentication system (NextAuth.js, Clerk, or custom solution)
   - Set up session management and cookie handling
   - Update `getUserId()` to match your chosen auth system's cookie/session structure
   - Consider using authorization headers (Bearer tokens) as alternative to cookies

2. **Enhanced Validation**
   - Add file content validation (not just MIME type) to prevent spoofing
   - Consider adding video duration limits for MP4 files
   - Add image dimension validation (min/max width/height)
   - Implement virus scanning for uploaded files (production)

3. **User Experience**
   - Show file upload progress indicator
   - Display file size and type in review step
   - Add preview for uploaded images/videos before submission
   - Implement "Applied" state on job cards to prevent duplicate applications

4. **Error Handling**
   - Replace `alert()` calls with proper toast notifications
   - Add retry logic for failed uploads
   - Better error messages for network failures
   - Logging for debugging production issues

5. **Security**
   - Add rate limiting to prevent abuse
   - Implement CSRF protection
   - Add file content scanning (malware detection)
   - Validate user permissions (ensure user can only apply as themselves)

6. **Testing**
   - Add unit tests for validation functions
   - Add integration tests for API route
   - Test with various file types and sizes
   - Test authentication flow end-to-end

---

### Update: Duplicate Application Check & Code Documentation

**Date:** Current Session

**Changes Made:**

1. **Fixed Duplicate Application Check**
   - ✅ Fixed bug where duplicate check was using hardcoded `"TEMP_TALENT_ID"` instead of authenticated `talentId`
   - ✅ Now properly prevents users from applying to the same job twice
   - ✅ Returns 400 error with clear message if duplicate application detected

2. **Enhanced Code Documentation**
   - ✅ Added comprehensive JSDoc comment for POST endpoint
   - ✅ Added inline comments explaining each step of the application process
   - ✅ Documented request/response formats
   - ✅ Added comments for database operations, Cloudinary upload, and validation steps

**Files Modified:**
- `web/app/api/apply/route.ts` - Fixed duplicate check bug and added comprehensive comments

**Next Steps & Recommendations:**

1. **Duplicate Application Handling**
   - Consider showing "Already Applied" state in UI before user attempts to apply
   - Add visual indicator on job cards for jobs user has already applied to
   - Consider allowing users to update their existing application instead of blocking

2. **Error Handling**
   - Add more specific error messages for different failure scenarios
   - Log duplicate application attempts for analytics
   - Consider rate limiting per user to prevent spam

3. **Testing**
   - Add test case for duplicate application prevention
   - Test with multiple users applying to same job
   - Verify error messages are user-friendly

---

### Update: Applied Status Feature & UI Feedback

**Date:** Current Session

**Changes Made:**

1. **New API Route: Applied Status Check**
   - ✅ Created `/api/apply/status/route.ts` - GET endpoint to check if user has applied to a job
   - ✅ Uses authenticated user ID from cookies (same pattern as apply route)
   - ✅ Returns `{ applied: boolean }` response
   - ✅ Handles missing jobId and unauthenticated users gracefully

2. **Job Detail Modal Updates**
   - ✅ Added `hasApplied` state to track application status
   - ✅ Fetches applied status on modal open using `useEffect`
   - ✅ Button shows "Applied" state when user has already applied
   - ✅ Button is disabled when already applied or while checking status
   - ✅ Refreshes status after ApplyFlowModal closes (in case application was successful)

3. **Jobs Preview Component Updates**
   - ✅ Added unique IDs to all job objects
   - ✅ Added `appliedJobs` state to track which jobs user has applied to
   - ✅ Checks applied status for all jobs on component mount
   - ✅ Displays "Applied" badge on job cards for applied jobs
   - ✅ Refreshes applied status when job detail modal closes

**Files Created:**
- `web/app/api/apply/status/route.ts` - New API route for checking applied status

**Files Modified:**
- `web/app/components/job-detail-modal.tsx` - Added applied status check and UI feedback
- `web/app/components/jobs-preview.tsx` - Added applied badges and status tracking

**Next Steps & Recommendations:**

1. **Performance Optimization**
   - Consider batching status checks in a single API call instead of multiple requests
   - Add caching for applied status to reduce database queries
   - Implement optimistic UI updates when user applies

2. **User Experience**
   - Add loading skeleton while checking applied status
   - Show toast notification when application is successfully submitted
   - Consider allowing users to view/edit their submitted application
   - Add "View Application" button for applied jobs instead of just disabling

3. **Data Management**
   - Add timestamps to Application model to track when applications were submitted
   - Consider adding application status (submitted, reviewed, shortlisted, rejected)
   - Add ability to track multiple application attempts (if allowed)

4. **Testing**
   - Test applied status check with authenticated and unauthenticated users
   - Test status refresh after successful application
   - Test with multiple jobs and verify badges appear correctly
   - Test edge cases (network errors, API failures)

5. **Future Enhancements**
   - Add "My Applications" page/dashboard
   - Show application history and status updates
   - Allow users to withdraw applications
   - Add notifications when application status changes

---

---

## 🔮 Suggested Improvements & Future Enhancements

### High Priority

1. **Talent Reply Functionality**
   - Currently talents can only view messages, not reply
   - Implement POST endpoint for talent messages
   - Update message thread modal with reply input
   - Add validation and notification system

2. **Real-time Notifications**
   - Replace polling with WebSocket connections
   - Implement server-sent events (SSE) for notifications
   - Add push notifications for mobile devices
   - Real-time notification badges

3. **Enhanced Search & Filtering**
   - Add search functionality to jobs listing
   - Filter jobs by type, location, budget range
   - Filter talents by role, skills, location
   - Advanced search with multiple criteria

4. **Application Analytics**
   - Director dashboard analytics (views, applications, conversion rates)
   - Talent dashboard analytics (application success rate)
   - Job performance metrics
   - Trust score impact visualization

### Medium Priority

5. **Enhanced Messaging**
   - File attachments in messages
   - Message read receipts
   - Typing indicators
   - Message search functionality
   - Message archiving

6. **Profile Enhancements**
   - Video portfolio uploads
   - Social media links
   - References/recommendations system
   - Skills verification
   - Portfolio categorization

7. **Job Posting Enhancements**
   - Job templates for common roles
   - Bulk job posting
   - Job scheduling (post later)
   - Job analytics dashboard
   - Application deadline reminders

8. **Trust System Enhancements**
   - Trust score history graph
   - Trust score breakdown by action type
   - Trust score recovery mechanisms
   - Trust-based job promotion features
   - Trust score leaderboard (optional)

### Low Priority

9. **Social Features**
   - Talent following system
   - Director favorites
   - Public talent portfolios
   - Talent recommendations
   - Community features

10. **Mobile App**
    - React Native mobile app
    - Push notifications
    - Mobile-optimized workflows
    - Offline capabilities
    - Mobile-specific features

11. **Advanced Features**
    - Video interview scheduling
    - Calendar integration
    - Contract management
    - Payment processing
    - Escrow system

12. **Admin Panel**
    - Full admin dashboard
    - User management
    - Trust score overrides
    - Content moderation
    - Analytics and reporting

### Technical Improvements

13. **Performance**
    - Implement Redis caching
    - Database query optimization
    - Image CDN optimization
    - Code splitting improvements
    - Lazy loading enhancements

14. **Testing**
    - Unit tests for utility functions
    - Integration tests for API routes
    - E2E tests for critical flows
    - Performance testing
    - Security testing

15. **Monitoring & Analytics**
    - Error tracking (Sentry)
    - Performance monitoring
    - User analytics
    - A/B testing framework
    - Feature flags

16. **Security Enhancements**
    - Rate limiting implementation
    - CSRF protection
    - File upload security scanning
    - API rate limiting per user
    - Two-factor authentication

---

## 📚 Key Files & Patterns

### Critical Files for Understanding the System

**Authentication:**
- `web/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `web/lib/auth-helpers.ts` - Auth utility functions
- `web/middleware.ts` - Route protection and verification enforcement

**Trust System:**
- `web/lib/director-trust.ts` - Core trust logic, capabilities, badges
- `web/models/user.ts` - User model with trustScore field
- `web/app/components/director/dashboard/components/director-trust-panel.tsx` - Trust UI

**Profile System:**
- `web/lib/profile-completion.ts` - Profile completion calculation
- `web/app/api/talent/profile/route.ts` - Profile CRUD operations
- `web/app/talent/profile/page.tsx` - Profile editing UI

**Notification System:**
- `web/models/notification.ts` - Notification schema
- `web/app/api/notifications/route.ts` - Notification API
- `web/app/components/notifications/notification-dropdown.tsx` - Notification UI

**Messaging:**
- `web/models/message.ts` - Message schema
- `web/app/api/director/messages/route.ts` - Director message sending
- `web/app/api/talent/messages/route.ts` - Talent message fetching

### Design Patterns

**Modal Pattern:**
- All modals use Framer Motion for animations
- Consistent backdrop blur and dark overlay
- Modal shell component for reusable structure

**API Pattern:**
- All API routes use `requireVerifiedUser()` or `getUserId()` for auth
- Consistent error handling and response formats
- MongoDB connection caching via `connectDB()`

**Component Pattern:**
- Client components marked with `"use client"`
- Server components for data fetching
- Consistent TypeScript types across components

**State Management:**
- React hooks for local state
- Server-side data fetching with Next.js App Router
- Session state via NextAuth.js

---

---

## 🗄️ Database Models

### User Model (`models/user.ts`)
- **Fields:**
  - `email` (String, unique, indexed) - User email address
  - `passwordHash` (String) - Bcrypt hashed password
  - `role` (Enum: "TALENT" | "DIRECTOR" | "ADMIN", indexed) - User role
  - `emailVerified` (Date) - Email verification timestamp
  - `name` (String) - User display name
  - `image` (String) - Profile image URL
  - `resetPasswordToken` (String) - Password reset token
  - `resetPasswordExpires` (Date) - Token expiration
  - `profileCompletion` (Number, 0-100) - Talent profile completion %
  - `verificationTier` (Enum: "BASIC" | "COMPLETE" | "VERIFIED" | "FEATURED") - Talent tier
  - `trustScore` (Number, 0-100) - Director trust score
  - `phone`, `bio`, `primaryRole`, `skills[]`, `experience[]`, `portfolio[]` - Talent profile fields
- **Indexes:** email, role, verificationTier

### Job Model (`models/job.ts`)
- **Fields:**
  - `title`, `description`, `type`, `location`, `budget`, `deadline`
  - `directorId` (ObjectId, indexed) - Director who posted
  - `status` (Enum: "active" | "closed" | "draft")
  - `requirements[]`, `tags[]`
- **Indexes:** directorId, status, deadline

### Application Model (`models/application.ts`)
- **Fields:**
  - `jobId` (ObjectId, indexed) - Job applied to
  - `talentId` (ObjectId, indexed) - Talent who applied
  - `answer` (String) - Application answer
  - `mediaUrl` (String) - Uploaded media URL
  - `status` (Enum: "submitted" | "shortlisted" | "rejected")
- **Indexes:** jobId, talentId, status

### Message Model (`models/message.ts`)
- **Fields:**
  - `applicationId` (ObjectId, indexed) - Related application
  - `jobId` (ObjectId) - Related job
  - `directorId` (ObjectId) - Director sender
  - `talentId` (ObjectId) - Talent recipient
  - `senderId` (ObjectId) - Actual sender
  - `senderRole` (Enum: "director" | "talent")
  - `message` (String) - Message content
  - `deliveryMethod` (Enum: "in-app" | "email" | "phone")
  - `sent` (Boolean), `sentAt` (Date)
- **Indexes:** applicationId, directorId, talentId

### Notification Model (`models/notification.ts`)
- **Fields:**
  - `userId` (String, indexed) - Recipient user ID
  - `type` (Enum: "message" | "application_status" | "job_posted" | "system", indexed)
  - `entityId` (String, indexed) - Related entity ID
  - `title` (String) - Notification title
  - `message` (String) - Notification message
  - `read` (Boolean, default: false, indexed)
- **Indexes:** userId, userId+read, userId+createdAt

### Session Model (`models/session.ts`)
- NextAuth.js session storage
- **Fields:** sessionToken, userId, expires
- **Indexes:** sessionToken, userId, expires

### VerificationToken Model (`models/verification-token.ts`)
- Email verification token storage
- **Fields:** identifier, token, expires
- **Indexes:** token, identifier+token

### AuditLog Model (`models/audit-log.ts`)
- Admin action audit trail
- **Fields:**
  - `actorId` (String, indexed) - Admin who performed action
  - `actorRole` (Enum: "ADMIN" | "SYSTEM") - Actor role
  - `targetUserId` (String, indexed) - User affected
  - `targetUserRole` (Enum: "TALENT" | "DIRECTOR") - Target user role
  - `actionType` (Enum, indexed) - Type of action performed
  - `beforeState` (Mixed) - State before action
  - `afterState` (Mixed) - State after action
  - `reason` (String) - Mandatory reason for action
  - `metadata` (Mixed) - Additional action metadata
- **Indexes:** targetUserId+createdAt, actorId+createdAt, actionType+createdAt

---

## 🔌 API Reference

### Authentication Endpoints
- `POST /api/auth/[...nextauth]` - NextAuth.js handler
- `POST /api/auth/complete` - Complete signup flow
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/reset-password` - Reset password with token

### Job Endpoints
- `GET /api/jobs` - Get public job listings (sorted by trust + deadline)
- `GET /api/director/jobs` - Get director's jobs
- `POST /api/director/jobs` - Create new job (trust-based limits)
- `PATCH /api/director/jobs/[id]` - Update job
- `DELETE /api/director/jobs/[id]` - Delete job

### Application Endpoints
- `POST /api/apply` - Submit job application
- `GET /api/apply/status?jobId=...` - Check if user applied
- `GET /api/director/applications` - Get director's applications
- `PATCH /api/director/applications/[id]` - Update application status
- `PATCH /api/director/applications/bulk` - Bulk update (trust-based)
- `GET /api/talent/applications` - Get talent's applications

### Profile Endpoints
- `GET /api/talent/profile` - Get talent profile
- `PATCH /api/talent/profile` - Update talent profile
- `GET /api/talent/profile/completion` - Get profile completion data
- `GET /api/director/profile` - Get director profile/trust

### Messaging Endpoints
- `GET /api/messages` - Get messages (universal, filtered by user)
- `POST /api/director/messages` - Send message (director → talent)
- `GET /api/director/messages/threads` - Get message threads (director)
- `GET /api/talent/messages?applicationId=...` - Get messages (talent)

### Notification Endpoints
- `GET /api/notifications` - Get notifications (with filters)
- `PATCH /api/notifications` - Mark notifications as read
- `GET /api/notifications/unread-count` - Get unread count

### Upload Endpoints
- `POST /api/upload` - Upload file to Cloudinary

### Admin Endpoints
- `POST /api/admin/setup` - Create initial admin user
- `GET /api/admin/trust/talent/[id]` - Get talent trust data for admin
- `GET /api/admin/trust/director/[id]` - Get director trust data for admin
- `POST /api/admin/trust/override` - Apply trust/verification tier override
- `GET /api/admin/users/[id]/profile` - View user profile (read-only)
- `POST /api/admin/users/[id]/freeze` - Freeze user account
- `POST /api/admin/users/[id]/unfreeze` - Unfreeze user account
- `POST /api/admin/users/[id]/restrictions` - Apply/remove user restrictions
- `GET /api/admin/jobs` - List all jobs (with filters: status, hidden)
- `POST /api/admin/jobs/[id]/actions` - Admin job actions (close early, hide/unhide)
- `GET /api/admin/jobs/[id]/applications` - View applications for a job

---

---

## 🔐 Admin Trust Override System

### Overview

The admin trust override system allows administrators to understand why users have specific trust levels and safely change them. All actions are logged and require mandatory confirmation.

### Entry Points

- `/admin/trust/talent/[id]` - Manage talent trust/verification tier
- `/admin/trust/director/[id]` - Manage director trust score and level

### Features

1. **Identity Header**
   - User avatar, name, email, role
   - Current tier/trust score display
   - Status badges (Verified, High Risk, Featured)
   - Always visible at top of page

2. **Trust Breakdown Panel (Read Only)**
   - Explains machine logic behind trust scores
   - Shows individual score components
   - Color-coded (green for positive, red for negative)
   - No editing capability

3. **Timeline/History Panel**
   - Complete audit trail of trust changes
   - Shows action type, before/after states, reason, actor
   - Chronological order (newest first)
   - Builds confidence and accountability

4. **Trust Override Action Panel**
   - **Change Trust/Verification Tier**: Promote or demote tier with mandatory reason
   - **Override Trust Score**: Manually set trust score (directors only)
   - **Freeze/Unfreeze Account**: Freeze user account temporarily or indefinitely
   - **Apply Restrictions**: 
     - For Talents: Shadow-limit (reduce visibility)
     - For Directors: Freeze posting, disable messaging, flag as high risk
   - All restrictions require reason and optional expiration date

5. **Confirmation Flow**
   - Mandatory confirmation modal for all actions
   - Shows action description and reason
   - Warning about logging and permanence
   - No silent actions

### API Endpoints

#### Trust Override
- `GET /api/admin/trust/talent/[id]` - Get talent trust data (including verification data)
- `GET /api/admin/trust/director/[id]` - Get director trust data (including trust breakdown)
- `POST /api/admin/trust/override` - Apply trust/verification tier override
- `POST /api/admin/users/[id]/freeze` - Freeze user account
- `POST /api/admin/users/[id]/unfreeze` - Unfreeze user account
- `POST /api/admin/users/[id]/restrictions` - Apply or remove restrictions (shadow-limit, disable messaging, freeze posting, flag high risk)
- `GET /api/admin/users/[id]/profile` - View user profile (read-only, includes verification data for talents)

#### Job Management
- `GET /api/admin/jobs` - List all jobs (including hidden ones) with filters
- `POST /api/admin/jobs/[id]/actions` - Admin job actions (close early, hide/unhide)
- `GET /api/admin/jobs/[id]/applications` - View all applications for a job (read-only)

### Database Models

**AuditLog Model** (`models/audit-log.ts`):
- Tracks all admin actions
- Fields: actorId, actorRole, targetUserId, targetUserRole, targetJobId, actionType, beforeState, afterState, reason, metadata
- Action types: TRUST_TIER_CHANGE, VERIFICATION_TIER_CHANGE, TRUST_SCORE_OVERRIDE, RESTRICTION_APPLIED, RESTRICTION_REMOVED, FLAG_ADDED, FLAG_REMOVED, ACCOUNT_FROZEN, ACCOUNT_UNFROZEN, JOB_CLOSED_EARLY, JOB_HIDDEN, JOB_UNHIDDEN, OTHER
- Indexed for performance queries

**User Model** (admin fields):
- `frozen`: Boolean - Account frozen status
- `shadowLimited`: Boolean - Reduced visibility (talent)
- `messagingDisabled`: Boolean - Messaging disabled (director)
- `postingFrozen`: Boolean - Job posting frozen (director)
- `highRisk`: Boolean - High risk flag (internal, director)
- `paymentConfirmed`: Boolean - Payment confirmed by admin
- `paymentMethod`: String (ETH | BTC | null) - Payment method used
- `paymentReference`: String - Transaction hash or reference
- `paymentAt`: Date - When payment was confirmed

---

## 📋 Implementation Summary

### Payment System (January 2026)

**What was completed:**
1. ✅ **Database Models**
   - Added `Settings` model to store payment wallet addresses (ETH/BTC)
   - Extended `User` model with payment fields: `paymentConfirmed`, `paymentMethod`, `paymentReference`, `paymentAt`
   - Payment confirmation creates audit log entry

2. ✅ **Admin API Routes**
   - `GET/POST /api/admin/payment` - Read/update global payment addresses (admin only)
   - `GET /api/admin/users/awaiting-payment?page=1&limit=20` - List users awaiting payment with pagination
   - `POST /api/admin/users/[id]/confirm-payment` - Confirm payment, unlock user account, log action
   - `POST /api/admin/users/bulk-confirm-payment` - Bulk confirm multiple payments at once
   - `GET /api/admin/payments/history?page=1&limit=20&method=ETH&email=test&startDate=...&endDate=...` - Payment history with filters

3. ✅ **Admin UI** (`/admin/payments`)
   - View/edit ETH and BTC payment addresses
   - View list of awaiting-payment users with pagination (20 per page)
   - Bulk selection checkboxes for multi-user confirmation
   - Single payment confirmation modal (method + optional reference)
   - Bulk payment confirmation with single action
   - Link to payment history page

4. ✅ **Payment History Page** (`/admin/payments/history`)
   - Complete payment history table with all confirmed payments
   - Filters: Payment Method (ETH/BTC), Email search, Date range (start/end)
   - Pagination for large datasets
   - Export to CSV button (downloads as .csv file with timestamp)
   - Shows: Email, Name, Method, Transaction Hash, Payment Date, Registered Date

5. ✅ **Production Build**
   - Zero TypeScript errors
   - All 58 routes compiled successfully
   - New routes: `/admin/payments/history` (static), `/api/admin/payments/history` (dynamic), `/api/admin/users/bulk-confirm-payment` (dynamic)

---

## 🔮 What's Next

### Phase 1: User-Facing Payment Flow (Immediate) ✅ COMPLETED
1. ✅ **Talent Registration Gating**
   - When talent registers, freeze account by default (restrict `frozen: true`)
   - Show payment gateway page (`/auth/payment-required`)
   - Display admin-configured ETH and BTC addresses
   - Add payment tracking: `paymentReference` → tx hash
   - Fetch payment addresses from `GET /api/admin/payment` at signup

2. ✅ **Payment Gateway Integration**
   - ETH: Integrate Etherscan API or Web3 provider (e.g., ethers.js, wagmi) to verify transaction
   - BTC: Use blockchain API (e.g., Blockchain.info, Blockchair) to verify transaction
   - Auto-detection: Scan wallets for payment to admin address

3. ✅ **Payment Status Page**
   - Talent-facing dashboard to check payment status
   - Show tx confirmation state (pending, confirmed, failed)
   - Manual entry form to submit tx hash for verification
   - Admin can manually confirm if auto-detection fails

### Phase 2: Jobs Access Control ✅ COMPLETED
1. ✅ **Apply Gating**
   - Only show jobs to talents with `paymentConfirmed: true`
   - Redirect unpaid talents to payment page
   - Block direct API access for unpaid users

2. ✅ **Jobs Listing Endpoint**
   - Add check: `if (talent.paymentConfirmed === false) return 403 "Payment required"`

### Phase 3: Payment Dashboard Enhancement ✅ COMPLETED
1. ✅ **Admin Payments Page Improvements**
   - Bulk selection checkboxes for multi-user confirmation
   - Pagination support (page, limit parameters)
   - Link to payment history page

2. ✅ **User Payment History**
   - New page: `/admin/payments/history` showing all confirmed payments
   - Filters: date range, payment method, user email
   - Export to CSV
   - Pagination for large datasets

### Phase 4: Automation & Monitoring (Next)
1. **Payment Webhooks**
   - Set up blockchain webhooks to auto-confirm payments
   - Listen for tx confirmation, auto-unlock user
   - Retry logic for failed verification

2. **Payment Reminders**
   - Email reminder to unpaid talents after 24h, 3d, 7d
   - Link in email to payment page
   - Track reminder sends in audit log

### Phase 5: Testing & QA
1. **End-to-End Testing**
   - Test: Register talent → freeze → pay → verify → unlock → access jobs
   - Test: Admin manual confirmation
   - Test: Multiple payment methods
   - Test: Bulk confirmation workflow

2. **Edge Cases**
   - Duplicate payments
   - Partial payments
   - Blockchain transaction reorg handling
   - Failed/pending transactions

---

## 🛠 Technical Debt & Improvements

### Short-term
- [ ] Replace prompt-based UI with modal form for payment confirmation
- [ ] Add error boundaries to admin pages
- [ ] Add loading states and optimistic updates
- [ ] Implement pagination in awaiting-payment list

### Medium-term
- [ ] Add payment webhooks for blockchain verification
- [ ] Implement bulk operations for admin
- [ ] Add caching layer for payment addresses (Redis)
- [ ] Set up payment verification job (cron)

### Long-term
- [ ] Migrate to professional payment processor (Stripe, Coinbase Commerce)
- [ ] Implement recurring payments for annual subscription model
- [ ] Add invoice generation and PDF export
- [ ] Integrate accounting/bookkeeping system

---

## 📚 Local Development

### Start Dev Server
```bash
npm run dev
# Dev server runs on http://localhost:3001 (port 3000 may be in use)
```

### Access Admin Pages
1. Navigate to http://localhost:3001/admin/setup to create admin user (if first time)
2. Log in as admin at http://localhost:3001/auth
3. Visit http://localhost:3001/admin/payments to manage payment settings

### API Endpoints (Admin Only - Requires Auth)
- `GET /api/admin/payment` - Fetch current ETH/BTC addresses
- `POST /api/admin/payment` - Update ETH/BTC addresses
- `GET /api/admin/users/awaiting-payment` - List awaiting users
- `POST /api/admin/users/[id]/confirm-payment` - Confirm and unlock user

### Database Setup
- MongoDB connection required (set `MONGODB_URI` in `.env.local`)
- Models auto-migrate on first use
- No manual migration needed
- `restrictionReason`: String - Reason for restriction
- `restrictionExpiresAt`: Date - When restriction expires (null = indefinite)
- `restrictedBy`: String - Admin ID who applied restriction

**Job Model** (admin fields):
- `hidden`: Boolean - Shadow-hidden by admin
- `closedEarly`: Boolean - Closed early by admin
- `adminActionReason`: String - Reason for admin action
- `adminActionBy`: String - Admin ID who took action

### Security

- Admin routes protected by middleware
- Only users with `role: "ADMIN"` can access
- All actions require authentication
- All actions logged to audit trail
- Mandatory confirmation prevents accidental changes

### Visual Design Rules

- No distracting animations
- No gradients
- Minimal motion
- Red for destructive actions
- Gold/neutral for tier changes
- Serious, professional aesthetic

### Components

- `TrustOverridePage` - Main page component
- `IdentityHeader` - User identity display
- `TrustBreakdownPanel` - Read-only trust breakdown
- `TimelinePanel` - History/audit log display
- `TrustOverridePanel` - Action panel for overrides
- `ConfirmActionModal` - Mandatory confirmation modal

### Admin Functions Implemented

#### Talent Admin Functions
- ✅ View talent profile (read-only) - Full visibility
- ✅ View verification data - Docs, links, timestamps
- ✅ Promote verification tier - Requires reason
- ✅ Demote verification tier - Requires reason
- ✅ Freeze talent account - Temporary with optional expiration
- ✅ Shadow-limit talent - Reduced visibility
- ❌ Ban talent - Escalation only (not implemented)
- ❌ Edit profile fields - Never (not implemented)
- ❌ Delete account - Never (not implemented)

#### Director Admin Functions
- ✅ View director profile - Read-only
- ✅ View trust score breakdown - Signals + weights
- ✅ Promote trust tier - Manual override
- ✅ Demote trust tier - Manual override
- ✅ Freeze posting ability - Jobs hidden
- ✅ Disable messaging - Safety tool
- ✅ Flag as "High Risk" - Internal only
- ❌ Edit job content - Never (not implemented)
- ❌ Post jobs - Never (not implemented)

#### Job Admin Functions
- ✅ View all jobs - Even hidden ones
- ✅ View applications - Read-only
- ✅ Close job early - Safety action
- ✅ Hide job - Shadow-hide from public
- ❌ Delete job - Audit risk (not implemented)
- ❌ Modify applicant decisions - Director-owned (not implemented)

### Future Enhancements

- Moderation inbox for reported users
- Bulk actions for multiple users
- Advanced verification document management
- Automated restriction expiration

---

**Note:** This README is continuously updated. Always check the "Recent Changes & Updates" section for the latest modifications. When making changes, document them here following the established format.