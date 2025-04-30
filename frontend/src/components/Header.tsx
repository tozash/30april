"use client";
import * as React from "react";
import { useState } from "react";
import ProgressBar from "./ProgressBar";

interface HeaderProps {
  currentDay: number;
  currentCard: number;
  totalCards: number;
}

const Header: React.FC<HeaderProps> = ({ currentDay, currentCard, totalCards }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState({
    profile: false,
    logout: false,
  });

  return (
    <header className="w-full bg-white border border shadow">
      <div className="px-4 py-2 mx-auto max-w-[950px]">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold leading-8 text-gray-900">
            Flashcard Learner
          </h1>
          <div className="flex gap-4 items-center">
            <div className="px-4 py-1.5 bg-indigo-600 rounded-full shadow-[0px_1px_2px_rgba(79,70,229,0.1)]">
              <span className="text-sm font-medium leading-5 text-white">
                <span>Day </span>
                <span>{currentDay}</span>
              </span>
            </div>
            <div className="relative">
              <button
                className="flex gap-2 items-center px-3 py-2 rounded-lg"
                onClick={() => setDropdownVisible(!dropdownVisible)}
                onMouseEnter={() =>
                  setButtonHover({ ...buttonHover, profile: true })
                }
                onMouseLeave={() =>
                  setButtonHover({ ...buttonHover, profile: false })
                }
                style={{
                  background: buttonHover.profile ? "#F3F4F6" : undefined,
                }}
                aria-expanded={dropdownVisible}
                aria-haspopup="true"
              >
                <span className="text-sm font-medium leading-5 text-gray-900">
                  Sarah Chen
                </span>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              {dropdownVisible && (
                <div
                  className="absolute right-0 mt-2 bg-white rounded-lg border border shadow-sm w-48"
                  onClick={() => setDropdownVisible(false)}
                >
                  <button
                    className="p-2 w-full text-sm font-medium leading-5 text-left text-red-500"
                    onMouseEnter={() =>
                      setButtonHover({ ...buttonHover, logout: true })
                    }
                    onMouseLeave={() =>
                      setButtonHover({ ...buttonHover, logout: false })
                    }
                    style={{
                      background: buttonHover.logout ? "#FEF2F2" : undefined,
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ProgressBar currentCard={currentCard} totalCards={totalCards}></ProgressBar>
      </div>
    </header>
  );
};

export default Header;
