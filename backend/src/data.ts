export interface Flashcard {
    id: string;
    front: string;
    back: string;
    hint?: string;
    tags: string[];
    bucket: number;          // 0-5
    due: string;             // ISO yyyy-mm-dd
  }
  
const todayIso = () => new Date().toISOString().substring(0, 10);

export const cards: Flashcard[] = [
    {
        id: "1",
        front: "Capital of Georgia",
        back: "Tbilisi",
        hint: "Starts with T",
        tags: ["geo", "capital"],
        bucket: 0,
        due: todayIso()
    },
    {
        id: "2",
        front: "2 + 2",
        back: "4",
        tags: ["math"],
        bucket: 1,
        due: todayIso()
    }
];
