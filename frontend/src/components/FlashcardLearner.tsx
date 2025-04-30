"use client";
import * as React from "react";
import { useState } from "react";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Flashcard from "./Flashcard";
import ActionButtons from "./ActionButtons";
import CompletionScreen from "./CompletionScreen";

const FlashcardLearner: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(1);
  const [totalCards, setTotalCards] = useState(6);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswerAnimation, setShowAnswerAnimation] = useState(false);

  const [hintText, setHintText] = useState(
    "Hint: This is a common informal greeting used throughout the day",
  );
  const [answerText, setAnswerText] = useState("hello");
  const [questionText, setQuestionText] = useState("bonjour");

  const handleShowAnswer = () => {
    setShowAnswerAnimation(true);
    setShowAnswer(true);
    setTimeout(() => setShowAnswerAnimation(false), 300);
  };

  const handleRateCard = () => {
    const nextCard = currentCard + 1;
    setCurrentCard(nextCard);
    setShowAnswer(false);
    setShowHint(false);

    if (nextCard > totalCards) {
      setShowComplete(true);
    }
  };

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
    setCurrentCard(1);
    setShowComplete(false);
  };

  return (
    <div className="flex flex-col items-center w-screen bg-gray-50 min-h-screen">
      <Header currentDay={currentDay} currentCard={currentCard} totalCards={totalCards} />

      <div className="flex flex-col gap-8 items-center px-4 py-8 mx-auto w-full max-w-[950px]">
        {!showComplete ? (
          <>
            <div className="w-full">
              <Flashcard
                questionText={questionText}
                answerText={answerText}
                hintText={hintText}
                showHint={showHint}
                showAnswer={showAnswer}
                showAnswerAnimation={showAnswerAnimation}
              />

              <ActionButtons
                showAnswer={showAnswer}
                showHint={showHint}
                setShowHint={setShowHint}
                handleShowAnswer={handleShowAnswer}
                handleRateCard={handleRateCard}
              />
            </div>
          </>
        ) : (
          <CompletionScreen onNextDay={handleNextDay} />
        )}
      </div>

      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />',
          }}
        />
      </div>
    </div>
  );
};

export default FlashcardLearner;
