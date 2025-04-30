"use client";
import * as React from "react";
import { useState } from "react";

interface ActionButtonsProps {
  showAnswer: boolean;
  showHint: boolean;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  handleShowAnswer: () => void;
  handleRateCard: (label: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  showAnswer,
  showHint,
  setShowHint,
  handleShowAnswer,
  handleRateCard,
}) => {
  const [buttonHover, setButtonHover] = useState({
    hint: false,
    answer: false,
    wrong: false,
    hard: false,
    easy: false,
  });

  const handleHoverChange = (button: keyof typeof buttonHover, isHovering: boolean) => {
    setButtonHover((prev) => ({
      ...prev,
      [button]: isHovering,
    }));
  };

  return (
    <div className="flex flex-col gap-8 items-center mt-8">
      {!showAnswer ? (
        <div className="flex gap-4 justify-center w-full max-sm:flex-col">
          <HintButton
            showHint={showHint}
            setShowHint={setShowHint}
            isHovering={buttonHover.hint}
            onHoverChange={(isHovering) => handleHoverChange("hint", isHovering)}
          />

          <ShowAnswerButton
            handleShowAnswer={handleShowAnswer}
            isHovering={buttonHover.answer}
            onHoverChange={(isHovering) => handleHoverChange("answer", isHovering)}
          />
        </div>
      ) : (
        <div className="w-full">
          <h2 className="mb-6 text-xl font-medium leading-7 text-center text-gray-900">
            How did you do?
          </h2>
          <div className="flex gap-4 justify-center max-sm:flex-col">
            <RatingButton
              label="Wrong"
              emoji="👎"
              color="red"
              handleRateCard={() => handleRateCard("Wrong")}
              isHovering={buttonHover.wrong}
              onHoverChange={(isHovering) => handleHoverChange("wrong", isHovering)}
              description="Thumbs down gesture"
            />

            <RatingButton
              label="Hard"
              emoji="✋"
              color="amber"
              handleRateCard={() => handleRateCard("Hard")}
              isHovering={buttonHover.hard}
              onHoverChange={(isHovering) => handleHoverChange("hard", isHovering)}
              description="Palm forward gesture"
            />

            <RatingButton
              label="Easy"
              emoji="👍"
              color="emerald"
              handleRateCard={() => handleRateCard("Easy")}
              isHovering={buttonHover.easy}
              onHoverChange={(isHovering) => handleHoverChange("easy", isHovering)}
              description="Thumbs up gesture"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ButtonProps {
  isHovering: boolean;
  onHoverChange: (isHovering: boolean) => void;
}

interface HintButtonProps extends ButtonProps {
  showHint: boolean;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
}

const HintButton: React.FC<HintButtonProps> = ({
  showHint,
  setShowHint,
  isHovering,
  onHoverChange,
}) => (
  <div className="flex flex-col items-center">
    <button
      onClick={() => setShowHint(!showHint)}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="flex gap-2 items-center px-8 py-4 font-medium text-white rounded-lg transition-all duration-200 ease-in-out"
      style={{
        background: isHovering ? "#1F2937" : "#111827",
        transform: isHovering ? "translateY(-1px)" : undefined,
        boxShadow: isHovering
          ? "0px 4px 6px rgba(0,0,0,0.05)"
          : "0px 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <span>☝️</span>
      <span>Get Hint</span>
    </button>
    <span className="mt-2 text-sm leading-5 text-gray-500">
      Index finger up gesture
    </span>
  </div>
);

interface ShowAnswerButtonProps extends ButtonProps {
  handleShowAnswer: () => void;
}

const ShowAnswerButton: React.FC<ShowAnswerButtonProps> = ({
  handleShowAnswer,
  isHovering,
  onHoverChange,
}) => (
  <div className="flex flex-col items-center">
    <button
      onClick={handleShowAnswer}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="flex gap-2 items-center px-8 py-4 font-medium text-white rounded-lg transition-all duration-200 ease-in-out"
      style={{
        background: isHovering ? "#4338CA" : "#4F46E5",
        transform: isHovering ? "translateY(-1px)" : undefined,
        boxShadow: isHovering
          ? "0px 4px 6px rgba(79,70,229,0.05)"
          : "0px 1px 2px rgba(79,70,229,0.05)",
      }}
    >
      <span>✌️</span>
      <span>Show Answer</span>
    </button>
    <span className="mt-2 text-sm leading-5 text-gray-500">
      Two fingers up gesture
    </span>
  </div>
);

interface RatingButtonProps extends ButtonProps {
  label: string;
  emoji: string;
  color: "red" | "amber" | "emerald";
  description: string;
  handleRateCard: () => void;
}

const RatingButton: React.FC<RatingButtonProps> = ({
  label,
  emoji,
  color,
  description,
  handleRateCard,
  isHovering,
  onHoverChange,
}) => {
  const colorMap = {
    red: {
      base: "#EF4444",
      hover: "#DC2626",
      shadow: "rgba(239,68,68,0.05)",
    },
    amber: {
      base: "#F59E0B",
      hover: "#D97706",
      shadow: "rgba(245,158,11,0.05)",
    },
    emerald: {
      base: "#10B981",
      hover: "#059669",
      shadow: "rgba(16,185,129,0.05)",
    },
  } as const;

  const { base, hover, shadow } = colorMap[color];

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleRateCard}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className="px-8 py-4 font-medium text-white rounded-lg transition-all duration-200 ease-in-out"
        style={{
          background: isHovering ? hover : base,
          transform: isHovering ? "translateY(-1px)" : undefined,
          boxShadow: isHovering
            ? `0px 4px 6px ${shadow}`
            : `0px 1px 2px ${shadow}`,
        }}
      >
        <span>
          {emoji} {label}
        </span>
      </button>
      <span className="mt-2 text-sm leading-5 text-gray-500">
        {description}
      </span>
    </div>
  );
};

export default ActionButtons;
