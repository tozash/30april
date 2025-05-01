# ✍️  Specification — Gesture-Driven Flashcards Platform  
*Version 0.9 • 2025-05-01*

| Section | Title |
|---------|-------|
| 1 | [Introduction](#1-introduction) |
| 2 | [Overall Description](#2-overall-description) |
| 3 | [Functional Requirements](#3-functional-requirements) |
| 4 | [Non-Functional Requirements](#4-non-functional-requirements) |
| 5 | [System Architecture](#5-system-architecture) |
| 6 | [Data Model](#6-data-model) |
| 7 | [Public APIs](#7-public-apis) |
| 8 | [UI / UX Specification](#8-ui--ux-specification) |
| 9 | [Gesture Interaction Model](#9-gesture-interaction-model) |
| 10 | [Scheduling Algorithm](#10-scheduling-algorithm) |
| 11 | [Testing & Quality](#11-testing--quality) |
| 12 | [Glossary](#12-glossary) |
| 13 | [Revision History](#13-revision-history) |

---

## 1. Introduction
### 1.1 Purpose  
Provide a single authoritative reference for building, testing, and maintaining a **browser-extension + web app** that converts highlighted webpage text into spaced-repetition flashcards graded with **hand gestures**.

### 1.2 Scope  
*  **Extension**: lets users capture text and create flashcards.  
*  **Web app**: daily review of due flashcards.  
*  **Gesture SDK**: detects six gestures in real time.  
*  **Back-end services**: authentication, CRUD, and daily scheduling.  
*  **Firebase Firestore**: persistent storage.

### 1.3 Definitions  
See [§12 Glossary](#12-glossary).

---

## 2. Overall Description
| Item | Detail |
|------|--------|
| Product Context | Students, language learners, or developers reviewing technical docs. |
| User Classes | **Registered User** (primary), **Guest** (not supported). |
| Operating Environment | Chrome ≥ 117, Edge ≥ 117, modern desktop browsers for web app. |
| Constraints | Firebase **Spark plan** throughput limits; WebCam access required for gestures. |
| Assumptions | Single-device login per user; users consent to camera usage. |

---

## 3. Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR-1** | *Highlight-to-Flashcard*: When the extension is active and the user selects text, a floating **“➕ Add Flashcard”** button must appear just beneath the selection. |
| **FR-2** | *Flashcard Creation Modal*: Clicking the button opens a modal containing fields `front*`, `hint`, `tags[]`; `back` auto-filled with the selection. |
| **FR-3** | *POST /flashcards*: Submitting the modal sends an authenticated request that persists the card in Firestore with `bucket = 0`. |
| **FR-4** | *Auth Flow*: Users register, login (receive JWT), logout; all protected routes require `Authorization: Bearer <JWT>`. |
| **FR-5** | *GET /flashcards/today*: Returns all cards the scheduler marks **due today**. |
| **FR-6** | *Review UI*: Presents one flashcard at a time with **front → hint → answer → feedback** phases. |
| **FR-7** | *Gesture Control*: Camera is active; gestures **☝️, ✌️, 👍, 👎, ✋, 👌** trigger the respective UI actions with a **3 s confirmation countdown**. |
| **FR-8** | *Bucket Update*: After feedback, client calls `PUT /flashcards/{id}/{difficulty}`; server moves card according to Modified-Leitner rules. |
| **FR-9** | *Next-Day Transition*: When the batch is empty, UI shows **“Next Day”**; `👌` gesture (or click) starts the next batch. |
| **FR-10** | *Error Handling*: All network failures, auth errors, and camera issues are surfaced via toast notifications. |

---

## 4. Non-Functional Requirements

| ID | Category | Target |
|----|----------|--------|
| **NFR-1** | **Performance** | Gesture detection ≤ 35 ms/frame on a 2022 laptop. |
| **NFR-2** | **Security** | Passwords hashed with **bcrypt-12**; JWT HS256, 1 h expiry. |
| **NFR-3** | **Accessibility** | WCAG 2.1 AA colour contrast, full keyboard navigation. |
| **NFR-4** | **Reliability** | API uptime ≥ 99 % (dev baseline); graceful offline mode caches today’s batch. |
| **NFR-5** | **Maintainability** | 80 % statement coverage; ESLint/Prettier enforced; Conventional Commits. |
| **NFR-6** | **Scalability** | Scheduler API must handle 1 k concurrent users with p95 latency < 150 ms (Locust test). |

---

## 5. System Architecture

Backend uses node.js + typescript + fastify and connects to Firebase Firestore for storing and retrieving flashcards
