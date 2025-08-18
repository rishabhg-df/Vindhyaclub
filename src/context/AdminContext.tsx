'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type AdminContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedLoginStatus = localStorage.getItem('isAdminLoggedIn');
      if (storedLoginStatus === 'true') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Failed to read admin login status from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  const login = () => {
    try {
      localStorage.setItem('isAdminLoggedIn', 'true');
    } catch (error) {
       console.error('Failed to save admin login status to localStorage', error);
    }
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    try {
      localStorage.removeItem('isAdminLoggedIn');
    } catch (error) {
       console.error('Failed to remove admin login status from localStorage', error);
    }
    setIsLoggedIn(false);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
