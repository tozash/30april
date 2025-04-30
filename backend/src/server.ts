import 'dotenv/config';
console.log('🔥 FIREBASE_API_KEY=', process.env.FIREBASE_API_KEY)

import Fastify from "fastify";
import { cards, Flashcard } from "./data";
import firebaseAdmin from "./plugins/firebaseAdmin";
import authRoutes from "./routes/auth";

const app = Fastify({ logger: true });

// ─── Auth plugin ────────────────────────────────────────────────────────────────
app.register(firebaseAdmin);
app.register(authRoutes);

// ─── Routes ─────────────────────────────────────────────────────────────────────

// health
app.get("/health", () => ({ ok: true }));

// Get today’s due flashcards
app.get("/flashcards/today", { preHandler: app.auth }, (_, res) => {
  const today = new Date().toISOString().substring(0, 10);
  res.send(cards.filter((c) => c.due <= today));
});

// Create flashcard
app.post<{ Body: Omit<Flashcard, "id" | "bucket" | "due"> }>(
  "/flashcards",
  { preHandler: app.auth },
  (req, res) => {
    const card: Flashcard = {
      ...req.body,
      id: Math.random().toString(36).slice(2),
      bucket: 0,
      due: new Date().toISOString().substring(0, 10)
    };
    cards.push(card);
    res.code(201).send(card);
  }
);

// Update after review
app.put<{ Params: { id: string; diff: "easy" | "hard" | "wrong" } }>(
  "/flashcards/:id/:diff",
  { preHandler: app.auth },
  (req, res) => {
    const card = cards.find((c) => c.id === req.params.id);
    if (!card) return res.code(404).send({ message: "not found" });

    // dummy Leitner: wrong→0, hard→same, easy→+1 (max 5), next due = +bucket days
    if (req.params.diff === "wrong") card.bucket = 0;
    else if (req.params.diff === "easy") card.bucket = Math.min(card.bucket + 1, 5);

    const next = new Date();
    next.setDate(next.getDate() + Math.max(card.bucket, 1));
    card.due = next.toISOString().substring(0, 10);

    res.send(card);
  }
);

// bootstrap
const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("API listening on :3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
