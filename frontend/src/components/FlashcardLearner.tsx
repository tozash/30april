'use client';
import React, { useState } from 'react';
import Header from './Header';
import Flashcard from './Flashcard';
import ActionButtons from './ActionButtons';
import CompletionScreen from './CompletionScreen';
import HandVisualizer from './HandVisualizer';

interface User {
  id: string;
  username: string;
}

interface FlashcardLearnerProps {
  user: User | null;
  onLogout: () => void;
}

const FlashcardLearner: React.FC<FlashcardLearnerProps> = ({ user, onLogout }) => {
  const [currentCard, setCurrentCard] = useState(1);
  const totalCards = 6;                     // no need for setTotalCards if it never changes

  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswerAnimation, setShowAnswerAnimation] = useState(false);

  const [easyCount, setEasyCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [hintText] = useState(
    'Hint: This is a common informal greeting used throughout the day'
  );
  const [questionText] = useState('bonjour');
  const [answerText] = useState('hello');

  const handleShowAnswer = () => {
    setShowAnswerAnimation(true);
    setShowAnswer(true);
    setTimeout(() => setShowAnswerAnimation(false), 300);
  };

  const handleRateCard = (label: string) => {
    // 1) bump the counter
    switch (label) {
      case 'Easy':
        setEasyCount((c) => c + 1);
        break;
      case 'Hard':
        setHardCount((c) => c + 1);
        break;
      case 'Wrong':
        setWrongCount((c) => c + 1);
        break;
      default:
        break;
    }

    // 2) prepare the next index
    const next = currentCard + 1;
    // clamp it so we never exceed totalCards
    setCurrentCard(Math.min(next, totalCards));
    // reset UI
    setShowAnswer(false);
    setShowHint(false);

    // 3) if we've just gone past the last card, show completion
    if (next > totalCards) {
      setShowComplete(true);
    }
  };

  const handleNextDay = () => {
    setCurrentDay(prev => prev + 1);
    setCurrentCard(1);
    setShowComplete(false);
    // reset counts for the new day if desired:
    setEasyCount(0);
    setHardCount(0);
    setWrongCount(0);
  };

  return (
    <div className="flex flex-col items-center w-screen bg-gray-50 min-h-screen">
      <Header
        currentDay={currentDay}
        currentCard={currentCard}
        totalCards={totalCards}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex flex-col gap-8 items-center px-4 py-8 mx-auto w-full max-w-[950px]">
        <div className="absolute top-12.5 right-4 z-50 rounded-md max-w-[250px]">
          <HandVisualizer />
        </div>
        {!showComplete ? (
          <>
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
          </>
        ) : (
          <CompletionScreen
            onNextDay={handleNextDay}
            easy={easyCount}
            hard={hardCount}
            wrong={wrongCount}
          />
        )}
      </div>

      {/* If you really need the font link here, consider moving it to <head> */}
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<link href='https://fonts.googleapis.com/css2?family=Montserrat&display=swap' rel='stylesheet'/>",
        }}
      />
    </div>
  );
};

export default FlashcardLearner;
