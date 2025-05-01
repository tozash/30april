"use client";
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from "./components/authentification/AuthContext";
import LoginForm from "./components/authentification/LoginForm";
import SignupForm from "./components/authentification/SignupForm";
import FlashcardLearner from "./components/FlashcardLearner";
import { authAPI } from './services/api';

interface User {
  id: string;
  username: string;
}

const AppContent = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('idToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authAPI.login('dummy@example.com', 'dummy');
        if (response.idToken) {
          const username = localStorage.getItem('username');
          if (username) {
            setCurrentUser({ id: response.localId, username });
          }
        }
      } catch (error) {
        localStorage.removeItem('idToken');
        localStorage.removeItem('username');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('username', email);
      setCurrentUser({ id: response.localId, username: email });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authAPI.register(email, password, confirmPassword);
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('username', email);
      setCurrentUser({ id: response.localId, username: email });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('idToken');
      localStorage.removeItem('username');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        {showSignup ? (
          <SignupForm onSignup={handleRegister} onSwitchToLogin={() => setShowSignup(false)} />
        ) : (
          <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
        )}
      </div>
    );
  }

  return <FlashcardLearner user={currentUser} onLogout={handleLogout} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
