"use client";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./components/authentification/AuthContext";
import LoginForm from "./components/authentification/LoginForm";
import SignupForm from "./components/authentification/SignupForm";
import FlashcardLearner from "./components/FlashcardLearner";

const AppContent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md">
          {showSignup ? (
            <div>
              <SignupForm />
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Log in
                </button>
              </p>
            </div>
          ) : (
            <div>
              <LoginForm />
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setShowSignup(true)}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <FlashcardLearner user={user} onLogout={logout} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
