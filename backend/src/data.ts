export interface FlashcardBase {
    front: string
    back: string
    hint?: string
    tags: string[]
}

export interface Flashcard extends FlashcardBase {
    id: string
}
