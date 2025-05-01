# TODO.md

## Backend

_(a backward-looking "DONE" list to capture what the backend **already** delivers)_

The items below document every major capability, pattern, and safeguard that is present in the current codebase.  
Use it as a baseline for changelogs, onboarding, or bragging rights.

---

### 🎯 Architecture & Core Setup
- [x] **Fastify server bootstrap** (`src/server.ts`) with built-in JSON logger and `/health` route  
- [x] **Plugin-based composition** via `fastify-plugin` for clean DI:
  - `firebaseAdmin` → initialises Admin SDK once
  - `firestorePlugin` → injects `db` (Firestore client)
  - `authPlugin` → preHandler that verifies Firebase ID tokens
- [x] **TypeScript type augmentation** (`src/types/*.d.ts`) to extend Fastify's typings:
  - `app.db`, `app.firebaseAuth`, `app.auth`, and `request.uid`
- [x] **Environment-variable config** (`dotenv/config`) for sensitive values (`FIREBASE_API_KEY`)

---

### 🔐 Authentication & User Management
- [x] **Email/password registration & login** hitting Google Identity Toolkit REST API  
- [x] **Secure token verification** on every protected route (`app.auth` preHandler)  
- [x] **Logout route** that revokes refresh tokens server-side  
- [x] Firestore `users/{uid}` document auto-created at signup with `day` counter

---

### 🗂️ Flashcard Data Model & S-R Algorithm
- [x] **Bucketed spaced-repetition** (5 buckets; review cadence `day % 2^(bucket-1)`)  
- [x] **Firestore hierarchy**  
users/{uid}/ ├─ 1/ (bucket 1 cards) ├─ 2/ ├─ 3/ ├─ 4/ └─ 5/
- [x] **GET /flashcards/today**  
- Calculates current `day` → fetches all due buckets in parallel  
- Flattens to typed `Flashcard[]`
- [x] **POST /flashcards** — adds new card straight into **bucket 1**
- [x] **PUT /flashcards/:id/:feedback**  
- Locates card, deletes from old bucket, re-inserts into new bucket according to feedback (`easy`, `hard`, `wrong`)
- Caps movement to 1 ↔ 5 inclusive
- [x] Pure TypeScript **domain models**: `FlashcardBase`, `Flashcard`

---

### 👤 Miscellaneous User Endpoint
- [x] **POST /user/next-day** — increments user's global `day` counter (manual "start new day" trigger)

---

### 🧰 Developer Experience
- [x] **Top-level `pnpm`/`npm` scripts** (implicit) and TypeScript project layout  
- [x] Console-level debug logs for key Firebase interactions

---

### 🏁 What this means
Everything listed here is already implemented, functional, and committed

## Frontend

### 🎨 Core Setup & Architecture
- [ ] **Project Initialization**
  - [ ] Set up Vite + React + TypeScript
  - [ ] Configure TailwindCSS
  - [ ] Set up ESLint and Prettier
  - [ ] Configure build and dev scripts

### 🔐 Authentication Flow
- [ ] **Login Component**
  - [ ] Create login form with email/password
  - [ ] Add form validation
  - [ ] Implement error handling
  - [ ] Add loading states
  - [ ] Style with TailwindCSS

- [ ] **Registration Component**
  - [ ] Create registration form
  - [ ] Add password confirmation
  - [ ] Implement validation
  - [ ] Add error handling
  - [ ] Style consistently with login

- [ ] **Auth Context**
  - [ ] Set up AuthContext provider
  - [ ] Implement token management
  - [ ] Add protected routes
  - [ ] Handle auto-logout on token expiry

### 📱 Main Application
- [ ] **Layout & Navigation**
  - [ ] Create responsive layout
  - [ ] Add navigation header
  - [ ] Implement sidebar/menu
  - [ ] Add loading states

- [ ] **Flashcard Learning Interface**
  - [ ] Create flashcard display component
  - [ ] Add flip animation
  - [ ] Implement rating buttons (Easy/Hard/Wrong)
  - [ ] Add progress indicators
  - [ ] Show daily stats

- [ ] **Hand Gesture Controls**
  - [ ] Set up camera access
  - [ ] Implement hand pose detection
  - [ ] Add gesture recognition
  - [ ] Create visual feedback
  - [ ] Add progress indicators
  - [ ] Implement gesture commands:
    - [ ] Toggle hint (index finger)
    - [ ] Show answer (peace sign)
    - [ ] Rate card (thumbs up/down/flat)
    - [ ] Next day (ok sign)

- [ ] **Flashcard Creation**
  - [ ] Create form for new cards
  - [ ] Add rich text editing
  - [ ] Implement tag system
  - [ ] Add validation
  - [ ] Show success/error feedback

### 🎯 User Experience
- [ ] **Feedback & Notifications**
  - [ ] Add toast notifications
  - [ ] Implement error messages
  - [ ] Add loading indicators
  - [ ] Create success messages

- [ ] **Animations & Transitions**
  - [ ] Add page transitions
  - [ ] Implement card flip animations
  - [ ] Add gesture feedback animations
  - [ ] Create smooth loading states

### 📊 Statistics & Progress
- [ ] **Dashboard**
  - [ ] Show daily progress
  - [ ] Display card statistics
  - [ ] Add learning streak
  - [ ] Show bucket distribution

### 🧪 Testing & Quality
- [ ] **Unit Tests**
  - [ ] Set up testing framework
  - [ ] Write component tests
  - [ ] Add integration tests
  - [ ] Test auth flow

- [ ] **Performance**
  - [ ] Optimize bundle size
  - [ ] Implement lazy loading
  - [ ] Add error boundaries
  - [ ] Optimize images and assets

### 📱 Responsive Design
- [ ] **Mobile Support**
  - [ ] Ensure mobile-friendly layout
  - [ ] Add touch gestures
  - [ ] Optimize camera usage
  - [ ] Test on various devices

### 🚀 Deployment
- [ ] **Build & Deploy**
  - [ ] Set up CI/CD pipeline
  - [ ] Configure production build
  - [ ] Add environment variables
  - [ ] Deploy to hosting service

---

### 🏁 Progress Tracking
- [ ] Core Setup (0/4)
- [ ] Authentication (0/15)
- [ ] Main Application (0/20)
- [ ] User Experience (0/8)
- [ ] Statistics (0/4)
- [ ] Testing (0/8)
- [ ] Responsive Design (0/4)
- [ ] Deployment (0/4)

Total Progress: 0/67 tasks (0%)