
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { events as initialEvents } from '@/lib/data';

type EventContextType = {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (updatedEvent: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loading: boolean;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents: Event[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
      });

      if (fetchedEvents.length === 0) {
        // If no events in Firestore, populate with initial data
        const initialDataPromises = initialEvents.map(event => addDoc(collection(db, 'events'), event));
        await Promise.all(initialDataPromises);
        // Re-fetch after populating
        const newSnapshot = await getDocs(q);
        newSnapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
        });
      }
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!isInitialized) {
      fetchEvents();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), event);
      setEvents((prevEvents) => [{ id: docRef.id, ...event } as Event, ...prevEvents].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const eventDoc = doc(db, 'events', updatedEvent.id);
      await updateDoc(eventDoc, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Error deleting event from Firestore:', error);
      throw error;
    }
  };
  
  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, loading }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
