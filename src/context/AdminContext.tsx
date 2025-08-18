
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type AdminContextType = {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const IS_ADMIN_KEY = 'isAdmin';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedIsAdmin = sessionStorage.getItem(IS_ADMIN_KEY);
      if (storedIsAdmin === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Could not access sessionStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  const login = () => {
    try {
      sessionStorage.setItem(IS_ADMIN_KEY, 'true');
      setIsAdmin(true);
    } catch (error) {
      console.error('Could not access sessionStorage:', error);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(IS_ADMIN_KEY);
      setIsAdmin(false);
    } catch (error) {
      console.error('Could not access sessionStorage:', error);
    }
  };

  // Render children only after checking sessionStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
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
