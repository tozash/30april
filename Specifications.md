# 📚 **Gesture-Driven Flashcards Platform — Software Specification**  
*Version 1.0 • 2025-05-02 • Status: DRAFT*  

---

> **TL;DR** — A web/extension product that lets users turn any highlighted text into a spaced-repetition flashcard deck and review those cards in a **gesture-controlled** interface.  
> All technical details herein reflect the **current, already-implemented** codebase (`backend/` + `frontend/`) so that future contributors can understand, test, and extend it.

---

## 🗂 Table of Contents  
| § | Title |
|---|-------|
| 1 | [Introduction](#1-introduction) |
| 2 | [Stakeholders & Personas](#2-stakeholders--personas) |
| 3 | [System Context](#3-system-context) |
| 4 | [Architecture Overview](#4-architecture-overview) |
| 5 | [Data Model](#5-data-model) |
| 6 | [Scheduling Algorithm](#6-scheduling-algorithm) |
| 7 | [REST APIs](#7-rest-apis) |
| 8 | [Frontend UX Flows](#8-frontend-ux-flows) |
| 9 | [Gesture Interaction Model](#9-gesture-interaction-model) |
| 10 | [Functional Requirements](#10-functional-requirements) |
| 11 | [Non-Functional Requirements](#11-non-functional-requirements) |
| 12 | [Security & Privacy](#12-security--privacy) |
| 13 | [Quality & Testing Strategy](#13-quality--testing-strategy) |
| 14 | [Deployment & Ops](#14-deployment--ops) |
| 15 | [Glossary](#15-glossary) |
| 16 | [Revision History](#16-revision-history) |

---

## 1  Introduction
### 1.1 Purpose  
Deliver a single, living reference that matches the **checked-in code** (backend & frontend). Anyone should be able to:  

1. Understand how the product works end-to-end.  
2. Spin it up locally or in prod.  
3. Add features or write tests without tribal knowledge.

### 1.2 Scope  
The platform comprises four subsystems, all implemented:

| Sub-system | Description | Folder |
|------------|-------------|--------|
| **Browser Extension** | Turns highlighted webpage text into cards *(MVP code pending; spec included for future work)* | `extension/` (placeholder) |
| **Web App** | Daily review UI; gesture-controlled | `frontend/` |
| **Gesture SDK** | TFJS Handpose + rule-based pose classifier | `frontend/src/utils/HandPose.tsx` |
| **Backend Service** | Fastify + Firebase Admin; Auth & CRUD | `backend/` |

---

## 2  Stakeholders & Personas
| Persona | Needs | Pain Points solved |
|---------|-------|--------------------|
| **Language-Learner Lily** | Learn 30 vocabulary items a day without clicking buttons | Webcam gestures remove friction |
| **Developer Dan** | Review API snippets captured while reading docs | Browser extension → flashcards in 2 clicks |
| **Researcher Ravi** | Wants exportable, tagged decks | Tag field & forthcoming CSV export |
| **Future Contributor** | Quick onboarding | Type-safe code, spec, TODOs |

---

## 3  System Context  

```mermaid
flowchart LR
    A[Browser Extension] -- POST /flashcards --> B(Backend API)
    subgraph Web
      C[Web App] -- REST + JWT --> B
      C -- Firestore rules (indirect) --> D[Firestore]
    end
    B -- Admin SDK --> D
    C -- Webcam --> E[Handpose Model (TFJS)]
```

External systems: Firebase Google email + password auth, Firebase Firestore (persistence).

## 4 Architecture Overview
### 4.1 Backend (Fastify + TS)
Plugins

firebaseAdmin – initialises Admin SDK once

firestorePlugin – injects app.db

authPlugin – verifies Bearer <idToken> and sets request.uid

Routes (all implemented)

/auth/register | login | logout

/flashcards/today – due batch

/flashcards POST – create into bucket 1

/flashcards/:id/:feedback PUT – move bucket according to {easy, hard, wrong}

/user/next-day POST – increments day counter

/health – liveness

Type-safety via module augmentation (src/types/fastify-*.d.ts).

### 4.2 Frontend (React 18 + Vite + Tailwind)
Top-level App.tsx chooses between Auth forms and FlashcardLearner.

State lives in component tree (no Redux); Auth tokens in localStorage.

Major Components

Component	Purpose
FlashcardLearner	Orchestrates daily session; pulls cards; hands gesture events down
HandVisualizer	Webcam feed + landmark drawing + gesture classification + hold-timer
ActionButtons	Click-based fallback controls (same mapping as gestures)
Header	Day badge, progress bar, user dropdown
Flashcard	Animates question/hint/answer panes
CompletionScreen	Shows Easy/Hard/Wrong counts + “Next Day”

Styling: Tailwind v3, utility classes only; dark-mode TBD.

## 5 Data Model (Firestore)

```
users/{uid}
  ├─ email          : string
  ├─ day            : integer      // 0-based review day
  ├─ 1/             // sub-collection = Bucket 1
  │   └─ {cardId}
  │        ├─ front : string
  │        ├─ back  : string
  │        ├─ hint  : string?
  │        └─ tags  : string[]
  ├─ 2/ … 5/        // identical shape

```
Rationale — Buckets as sub-collections keep queries simple (collection('1')).

## 6 Scheduling Algorithm

| Bucket | Days between reviews | Condition (today = integer) |
|--------|---------------------|-----------------------------|
| 1 | 1 day | `day % 1 == 0` |
| 2 | 2 days | `day % 2 == 0` |
| 3 | 4 days | `day % 4 == 0` |
| 4 | 8 days | `day % 8 == 0` |
| 5 | 16 days | `day % 16 == 0` |

Implemented in routes/flashcards.ts → fetchFlashcardsForDay().

Feedback mapping:
| User feedback | New bucket |
|---------------|-----------|
| **Easy** | `min(b+1, 5)` |
| **Hard** | `max(b-1, 1)` |
| **Wrong** | `1` |

## 7 REST APIs

| Verb / Path | Auth? | Req Body | Response (200) | Notes |
|-------------|-------|----------|-----------------|-------|
| **POST** `/auth/register` | ❌ | `{email, password, confirmPassword}` | `{idToken, refreshToken, expiresIn, localId}` | Creates `users/{uid}` doc |
| **POST** `/auth/login` | ❌ | `{email, password}` | same | — |
| **POST** `/auth/logout` | ✅ | — | `204 No Content` | Revokes refresh tokens |
| **GET** `/flashcards/today` | ✅ | — | `Flashcard[]` | Uses `day` counter |
| **POST** `/flashcards` | ✅ | `FlashcardBase` | `{id, …}` | Inserts into bucket 1 |
| **PUT** `/flashcards/{id}/{feedback}` | ✅ | — | `Flashcard` | Moves card |
| **POST** `/user/next-day` | ✅ | — | `{day}` | Increments counter |
| **GET** `/health` | ❌ | — | `{ok:true}` | For probes |

## 8 Frontend UX Flows

### 8.1 Login / Signup
User fills form → authAPI.login|register → stores idToken & username in localStorage.

On page refresh App.tsx validates token by pinging /auth/login with dummy creds (will be replaced by /auth/verify endpoint).

### 8.2 Daily Review

```
Browser->Backend: GET /flashcards/today
Backend-->Browser: 200 Flashcard[]
Browser: Renders card #1
loop Per Card
  alt Hint?
    Gesture ☝️ or click
    Browser: show hint
  end
  alt Show answer
    Gesture ✌️ or click
    Browser: reveal answer
  end
  Gesture 👍/✋/👎 or click
  Browser->Backend: PUT /flashcards/{id}/{easy|hard|wrong}
  Backend-->Browser: 200
end
opt Session complete
   Gesture 👌 or click → POST /user/next-day
end
```

## 9 Gesture Interaction Model

Implementation: HandPose.tsx + HandVisualizer.tsx

| Pose Name | Emoji | Action when… | Hold duration |
|-----------|-------|-------------|---------------|
| **index_extended** | ☝️ | Show/Hide hint *(before answer)* | 3 s |
| **index_middle_extended** | ✌️ | Reveal answer | 3 s |
| **thumbs_up** | 👍 | Rate **Easy** *(after answer)* | 3 s |
| **flat_hand** | ✋ | Rate **Hard** | 3 s |
| **thumbs_down** | 👎 | Rate **Wrong** | 3 s |
| **ok_sign** | 👌 | “Next Day” *(any time completion screen visible)* | 3 s |

Hold progress bar displayed in video overlay prevents accidental firing. A 1 s cooldown prevents rapid multi-fires.

## 10 Functional Requirements

| ID | Requirement (implemented unless 🔜) |
|----|-------------------------------------|
| **FR-1** | Users can register/login/logout via REST (email + password). |
| **FR-2** | Authenticated users create flashcards (front/back/hint/tags). |
| **FR-3** | Scheduler returns only the cards due that day. |
| **FR-4** | Review UI allows hint → answer → feedback cycle. |
| **FR-5** | Six hand gestures drive the UI with a 3 s dwell timer. |
| **FR-6** | Feedback updates bucket placement server-side. |
| **FR-7** | “Next Day” button/gesture increments day and fetches new batch. |
| **FR-8** | ✅ *Already done* – all endpoints return proper status on error. |
| **FR-9** | 🔜 Browser extension for highlight-to-card capture. |

## 11 Non-Functional Requirements

| ID | Category | Target | Implementation note |
|----|----------|--------|---------------------|
| **NFR-1** | Performance | p95 API latency < 150 ms @ 1k concurrency | Fastify + Firestore connection pool |
| **NFR-2** | Gesture FPS | ≥ 25 FPS on 2023 laptop | TFJS WebGL backend |
| **NFR-3** | Accessibility | WCAG 2.1 AA | Tailwind colour tokens; all gestures have click fallback |
| **NFR-4** | Security | Firebase ID tokens verified server-side | `authPlugin` |
| **NFR-5** | Maintainability | 100 % typed, ESLint + Prettier | Config in repo |
| **NFR-6** | Scalability | Stateless API -> Cloud Run autoscale | Dockerfile TBD |

## 12 Security & Privacy
Passwords never hit backend; Firebase Auth handles hashing.

Tokens stored in localStorage; CSRF not a concern (SPA + token).

Client requests camera permission once; feed never leaves browser (landmarks only).

Firestore rules (to be finalised) restrict reads/writes to uid == auth.uid.

## 13 Quality & Testing Strategy

| Layer | Tooling | Status |
|-------|---------|--------|
| **Unit tests** | Jest + ts-jest – bucket maths, gesture helpers | 🔜 |
| **Integration** | Firebase Emulator Suite + Supertest | 🔜 |
| **E2E** | Playwright (headless + webcam mock) | 🔜 |
| **Linting** | ESLint (Airbnb) + Prettier | ✅ |
| **CI** | GitHub Actions (`ci.yml`) – lint → test → build | 🔜 |

Coverage threshold goal: 80 % statements.

## 14 Deployment & Ops

| Item | Detail |
|------|--------|
| **Container** | Multi-stage Node 20 Alpine, non-root UID 1001 |
| **Infra as Code** | Terraform modules for GCP project, Firestore, Cloud Run, Secret Manager |
| **Secrets** | `GOOGLE_APPLICATION_CREDENTIALS` & `FIREBASE_API_KEY` in Secret Mgr |
| **Observability** | Pino-structured logs → Cloud Logging; Prometheus metrics via `@fastify/metrics` |
| **Rollout** | GitHub Actions → Cloud Build → Cloud Run (blue/green) |

## 15 Glossary

| Term | Meaning |
|------|---------|
| **Bucket** | Sub-collection representing review interval power-of-two days |
| **Hand Pose** | One of “thumbs_up”, “flat_hand”, etc. |
| **Leitner System** | Classical card-bin spaced repetition algorithm |
| **Gesture Dwell** | Hold-time (3 s) before command executes |
