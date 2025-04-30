"use client";
import * as React from "react";
import { useState } from "react";

interface CompletionScreenProps {
  onNextDay: () => void;
  easy:number;
  hard:number;
  wrong:number;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onNextDay,easy,hard,wrong }) => {
  const [buttonHover, setButtonHover] = useState(false);

  return (
    <section className="text-center">
      <h2 className="mb-6 text-2xl font-medium leading-8 text-gray-900">
        Session Complete!
      </h2>
      <div className="flex gap-8 justify-center mb-8">
        <div className="text-center">
          <div className="font-bold text-emerald-500">{easy}</div>
          <div className="text-sm leading-5 text-gray-500">Easy</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-amber-500">{hard}</div>
          <div className="text-sm leading-5 text-gray-500">Hard</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-red-500">{wrong}</div>
          <div className="text-sm leading-5 text-gray-500">Wrong</div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="flex gap-2 items-center px-8 py-4 font-medium text-white bg-indigo-600 rounded-lg transition-all duration-200 ease-in-out shadow-[0px_1px_2px_rgba(79,70,229,0.05)]"
          onClick={onNextDay}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          style={{
            background: buttonHover ? "#4338CA" : "#4F46E5",
            transform: buttonHover ? "translateY(-1px)" : undefined,
            boxShadow: buttonHover
              ? "0px 4px 6px rgba(79,70,229,0.05)"
              : "0px 1px 2px rgba(79,70,229,0.05)",
          }}
        >
          <span>👌</span>
          <span>Go to Next Day</span>
        </button>
        <span className="mt-2 text-sm leading-5 text-gray-500">OK gesture</span>
      </div>
    </section>
  );
};

export default CompletionScreen;
