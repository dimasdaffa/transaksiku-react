import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUser } from '../Data/Dummy';

// Create context
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Initialize state from localStorage or use dummy data
  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return dummyUser;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  // User preferences
  const [preferences, setPreferences] = useState(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
    return {
      language: 'id',
      notifications: true,
      showBalance: true,
      currency: 'IDR',
      timeFormat: '24h'
    };
  });

  // Update localStorage when user data changes
  useEffect(() => {
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
    }
  }, [user]);
  
  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Update localStorage when login status changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);
  
  // Update localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);
  
  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  
  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
  };
  
  // Update user data
  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };
  
  // Update user balance (with optional optimistic update)
  const updateBalance = (amount, isOptimistic = false) => {
    if (isOptimistic) {
      setUser(prev => ({ ...prev, saldo: prev.saldo + amount }));
      return () => setUser(prev => ({ ...prev, saldo: prev.saldo - amount })); // Rollback function
    } else {
      setUser(prev => ({ ...prev, saldo: prev.saldo + amount }));
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // Update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn,
      theme,
      preferences,
      login,
      logout,
      updateUser,
      updateBalance,
      toggleTheme,
      updatePreferences
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;