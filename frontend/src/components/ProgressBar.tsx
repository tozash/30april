import * as React from "react";

interface ProgressBarProps {
  currentCard: number;
  totalCards: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentCard,
  totalCards,
}) => {
  const progressPercentage = (currentCard / totalCards) * 100;

  return (
    <div className="w-full">
      <div className="overflow-hidden w-full h-1 bg-gray-200 rounded-full">
        <div
          className="h-1 bg-indigo-600 rounded-full transition-all duration-300 ease-out ease-in-out"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      <div className="py-2 text-sm font-medium leading-5 text-gray-500">
        <span>Card </span>
        <span>{currentCard}</span>
        <span> of </span>
        <span>{totalCards}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
