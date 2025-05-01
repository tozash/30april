# TODO.md

## Backend

The items below document every major capability, pattern, and safeguard that is present in the current codebase.

---

### 🎯 Architecture & Core Setup
- [x] **Fastify server bootstrap** (`src/server.ts`) with built-in JSON logger and `/health` route  
- [x] **Plugin-based composition** via `fastify-plugin` for clean DI:
  - `firebaseAdmin` → initialises Admin SDK once
  - `firestorePlugin` → injects `db` (Firestore client)
  - `authPlugin` → preHandler that verifies Firebase ID tokens
- [x] **TypeScript type augmentation** (`src/types/*.d.ts`) to extend Fastify’s typings:
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
- [x] **POST /user/next-day** — increments user’s global `day` counter (manual “start new day” trigger)

---

### 🧰 Developer Experience
- [x] **Top-level `pnpm`/`npm` scripts** (implicit) and TypeScript project layout  
- [x] Console-level debug logs for key Firebase interactions

---

### 🏁 What this means
Everything listed here is already implemented, functional, and committed