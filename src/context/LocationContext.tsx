
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, query, limit, setDoc, doc } from 'firebase/firestore';
import type { Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';

type LocationContextType = {
  location: Location | null;
  loading: boolean;
  updateLocation: (newLocation: Omit<Location, 'id'>) => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();
  
  const fetchLocation = useCallback(async () => {
    setLoading(true);
    try {
      const locationCollection = collection(db, 'locations');
      const q = query(locationCollection, limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setLocation({ id: doc.id, ...doc.data() } as Location);
      } else {
        setLocation(null);
      }
    } catch (error) {
      console.error('Error fetching location from Firestore:', error);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchLocation();
    }
  }, [isInitialized, fetchLocation]);

  const updateLocation = async (newLocation: Omit<Location, 'id'>) => {
    try {
      // We assume there's only one location document, with a fixed ID 'main'.
      const locationRef = doc(db, 'locations', 'main');
      await setDoc(locationRef, newLocation);
      await fetchLocation(); // Refetch after updating
    } catch (error) {
      console.error('Error updating location in Firestore:', error);
      throw error;
    }
  };
  
  return (
    <LocationContext.Provider value={{ location, loading, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
