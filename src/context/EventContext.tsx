
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { format, parseISO } from 'date-fns';
import { useAdmin } from './AdminContext';

type EventContextType = {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (updatedEvent: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loading: boolean;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const formatEventFromFirestore = (doc: any): Event => {
    const data = doc.data();
    // Firestore Timestamps need to be converted to JS Dates, then formatted.
    const date = data.date instanceof Timestamp 
      ? format(data.date.toDate(), 'yyyy-MM-dd') 
      : data.date; // Keep it as a string if it's already formatted
    return { id: doc.id, ...data, date } as Event;
};

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents: Event[] = querySnapshot.docs.map(formatEventFromFirestore);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events from Firestore:', error);
      // On error, revert to an empty state to avoid hydration mismatch
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchEvents();
    }
  }, [isInitialized, fetchEvents]);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const eventDataWithTimestamp = {
        ...event,
        // Convert the string date back to a Timestamp for Firestore
        date: Timestamp.fromDate(parseISO(event.date)),
      };
      await addDoc(collection(db, 'events'), eventDataWithTimestamp);
      // Refetch all events to ensure data consistency
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      throw error; // Re-throw to be caught by the form handler
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const { id, ...eventData } = updatedEvent;
      const eventDocRef = doc(db, 'events', id);
      const eventDataWithTimestamp = {
        ...eventData,
        date: Timestamp.fromDate(parseISO(eventData.date)),
      };
      await updateDoc(eventDocRef, eventDataWithTimestamp);
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event from Firestore:', error);
      throw error;
    }
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, loading }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
