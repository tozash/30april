# 30april
software engineering midterm project

## Backend

node.js + fastify + Firebase Firestore

Stores flashcards in Firestore per user under buckets 1 to 5

Retrieves daily content based on which buckets satisfy "currentDay % 2<sup>bucketNumber - 1</sup> === 0"

Freshly added flashcards go into bucket 1

TODO: bucket updating logic