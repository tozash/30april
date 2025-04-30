import * as React from "react";

interface FlashcardProps {
  questionText: string;
  answerText: string;
  hintText: string;
  showHint: boolean;
  showAnswer: boolean;
  showAnswerAnimation: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  questionText,
  answerText,
  hintText,
  showHint,
  showAnswer,
  showAnswerAnimation,
}) => {
  return (
    <div className="flex overflow-hidden relative flex-col gap-8 justify-center items-center p-16 bg-white rounded-2xl shadow-sm min-h-[280px]">
      {!showAnswer && (
        <div
          className="text-5xl font-medium text-gray-900 transition-all duration-300 ease-out ease-in-out"
          style={{
            transform: showAnswerAnimation
              ? "translateY(-20px) scale(0.95)"
              : "translateY(0) scale(1)",
            opacity: showAnswerAnimation ? "0" : "1",
          }}
        >
          {questionText}
        </div>
      )}

      {showAnswer && (
        <div
          className="p-8 w-full text-5xl font-medium text-center text-gray-900 bg-blue-50 rounded-xl transition-all duration-300 ease-out ease-in-out"
          style={{
            transform: showAnswerAnimation
              ? "translateY(20px) scale(0.95)"
              : "translateY(0) scale(1)",
            opacity: showAnswerAnimation ? "0" : "1",
          }}
        >
          {answerText}
        </div>
      )}

      {showHint && !showAnswer && (
        <div
          className="p-4 text-lg leading-7 text-center text-gray-500 bg-gray-100 rounded-xl border border transition-all duration-200 ease-out ease-in-out max-w-[400px]"
          style={{
            transform: showHint ? "translateY(0)" : "translateY(10px)",
            opacity: showHint ? "1" : "0",
          }}
        >
          {hintText}
        </div>
      )}
    </div>
  );
};

export default Flashcard;
