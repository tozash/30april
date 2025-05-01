# 30april
software engineering midterm project

## Backend

node.js + fastify + Firebase Firestore

Manages user authentication, retrieving and updating flashcards, moving to next day

### Endpoints

- GET /health - health check
    - returns { "ok": True }

- POST /auth/register - register user with email, password and confirmPassword
Sample input:
```json
{
    "email": "iamhere@gmail.com",
    "password": "topsecret",
    "confirmPassword": "topsecret"
}
```

- POST /auth/login - login with username and password
Sample input:
```json
{
    "email": "iamhere@gmail.com",
    "password": "topsecret"
}
```

- POST /auth/logout

- POST /user/next-day - moves user to next day (increases "day" by 1 for this user in Firestore)

- GET /flashcards/today - gets the flashcards due for current day based on "currentDay % 2<sup>bucketNumber - 1</sup> === 0" logic

- POST /flashcards - adds a new flashcard at bucket 1
Sample input:
```json
{
    "front": "What is the answer to life, universe, and everything?",
    "back": "42",
    "hint": "Hitchhike",
    "tags": ["think", "galaxy", "meta"]
}
```

- PUT /flashcards/:id/:feedback - updates the card's bucket based on the feedback
Sample call: PUT /flashcards/3/wrong

### Aggregate

Also a useful thing to run for quick checking with LLMs is "npm run aggregate", which runs backend/scripts/aggregator.js and produces a .txt file with combined content of everything in backend/src

## Frontend

React + TypeScript + Vite + TailwindCSS

Features a modern web interface for flashcard learning with hand gesture controls.

### Components

- **HandVisualizer** - Camera-based hand gesture recognition for card interactions
  - Toggle hint (index finger)
  - Show answer (index + middle finger)
  - Rate cards (thumbs up/down, flat hand)
  - Next day (ok sign)

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Hand Gestures

- 👆 Index finger extended: Toggle hint
- ✌️ Index + middle fingers: Show answer
- 👍 Thumbs up: Rate card as Easy
- ✋ Flat hand: Rate card as Hard
- 👎 Thumbs down: Rate card as Wrong
- 👌 OK sign: Move to next day
