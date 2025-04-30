import Fastify from "fastify";
import jwt from "@fastify/jwt";
import authPlugin from "./plugins/auth";
import { cards, Flashcard } from "./data";

const app = Fastify({ logger: true });

// ─── Auth plugin ────────────────────────────────────────────────────────────────
app.register(jwt, { secret: "dev-secret-change-me" });
app.register(authPlugin);

// ─── Routes ─────────────────────────────────────────────────────────────────────

// health
app.get("/health", () => ({ ok: true }));

// Register / Login – both just hand back a dev token
app.post<{ Body: { username: string; password: string } }>(
  "/auth/register",
  async (req, res) => {
    const token = app.jwt.sign({ u: req.body.username });
    return res.send({ token });
  }
);
app.post("/auth/login", async (req, res) => {
  const token = app.jwt.sign({ u: "demo" });
  res.send({ token });
});
app.post("/auth/logout", async (_, res) => res.code(204).send());

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
