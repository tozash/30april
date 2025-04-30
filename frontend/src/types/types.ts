export interface ButtonHoverState {
    hint: boolean;
    answer: boolean;
    wrong: boolean;
    hard: boolean;
    easy: boolean;
    next: boolean;
    profile?: boolean;
    logout?: boolean;
  }
  
  export interface FlashcardData {
    front: string;
    back: string;
    hint: string;
  }
  