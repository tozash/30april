# 30april
software engineering midterm project

## Backend

node.js + fastify + Firebase Firestore

Manages user authentication, retrieving and updating flashcards, moving to next day

### Endpoints

GET /health - health check

- POST /auth/register - register user with username, password and confirmPassword
- POST /auth/login - login with username and password
- POST /auth/logout

- POST /user/next-day - moves user to next day (increases "day" by 1 for this user in Firestore)

- GET /flashcards/today - gets the flashcards due for current day based on "currentDay % 2<sup>bucketNumber - 1</sup> === 0" logic
- POST /flashcards - adds a new flashcard at bucket 1
- PUT /flashcards/:id/:feedback - updates the card's bucket based on the feedback

### Aggregate

Also a useful thing to run for quick checking with LLMs is "npm run aggregate", which runs backend/scripts/aggregator.js and produces a .txt file with combined content of everything in backend/src
