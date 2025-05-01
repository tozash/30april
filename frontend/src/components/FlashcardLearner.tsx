'use client';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Flashcard from './Flashcard';
import ActionButtons from './ActionButtons';
import CompletionScreen from './CompletionScreen';
import HandVisualizer from './HandVisualizer';
import { flashcardAPI } from '../services/api';
import { Flashcard as FlashcardType } from '../types/flashcard';

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
  const [totalCards, setTotalCards] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswerAnimation, setShowAnswerAnimation] = useState(false);
  const [easyCount, setEasyCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load flashcards when component mounts or user changes
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const cards = await flashcardAPI.getTodayCards();
        setFlashcards(cards);
        setTotalCards(cards.length);
        setCurrentCard(1);
        setShowAnswer(false);
        setShowHint(false);
        setShowComplete(false);
        setEasyCount(0);
        setHardCount(0);
        setWrongCount(0);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [user]);

  const handleShowAnswer = () => {
    setShowAnswerAnimation(true);
    setShowAnswer(true);
    setTimeout(() => setShowAnswerAnimation(false), 300);
  };

  const handleRateCard = async (label: string) => {
    if (!flashcards[currentCard - 1]) return;

    try {
      // Update the card's rating in the backend
      await flashcardAPI.rateCard(flashcards[currentCard - 1].id, label.toLowerCase() as 'easy' | 'hard' | 'wrong');

      // Update local state
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

      const next = currentCard + 1;
      setCurrentCard(Math.min(next, totalCards));
      setShowAnswer(false);
      setShowHint(false);

      if (next > totalCards) {
        setShowComplete(true);
      }
    } catch (error) {
      console.error('Error rating card:', error);
    }
  };

  const handleNextDay = async () => {
    try {
      setCurrentDay(prev => prev + 1);
      const cards = await flashcardAPI.getTodayCards();
      setFlashcards(cards);
      setTotalCards(cards.length);
      setCurrentCard(1);
      setShowComplete(false);
      setEasyCount(0);
      setHardCount(0);
      setWrongCount(0);
    } catch (error) {
      console.error('Error loading next day cards:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (flashcards.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No flashcards for today!</div>;
  }

  const currentFlashcard = flashcards[currentCard - 1];

  return (
    <div className="flex flex-col items-center w-screen bg-gray-50 min-h-screen overflow-x-hidden">
      <Header
        currentDay={currentDay}
        currentCard={currentCard}
        totalCards={totalCards}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex flex-col gap-8 items-center px-4 py-8 mx-auto w-full max-w-[950px] relative">
        <div className="fixed top-20 right-4 z-50">
          <HandVisualizer
            setShowHint={setShowHint}
            handleShowAnswer={handleShowAnswer}
            handleRateCard={handleRateCard}
            showAnswer={showAnswer}
            showHint={showHint}
            onNextDay={handleNextDay}
            showComplete={showComplete}
          />
        </div>
        {!showComplete ? (
          <>
            <Flashcard
              questionText={currentFlashcard.front}
              answerText={currentFlashcard.back}
              hintText={currentFlashcard.hint}
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
