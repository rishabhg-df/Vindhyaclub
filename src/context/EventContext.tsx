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
import { events as initialEvents } from '@/lib/data';
import { format } from 'date-fns';
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
    // Firestore Timestamps need to be converted to a serializable format.
    // We'll use YYYY-MM-DD strings, which is what our form expects.
    const date = data.date instanceof Timestamp ? format(data.date.toDate(), 'yyyy-MM-dd') : data.date;
    return { id: doc.id, ...data, date } as Event;
};


export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isInitialized } = useAdmin();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      let fetchedEvents: Event[] = querySnapshot.docs.map(formatEventFromFirestore);
      
      if (querySnapshot.empty && initialEvents.length > 0 && user) {
        console.log('No events found, populating with initial data...');
        for (const event of initialEvents) {
          await addDoc(collection(db, 'events'), {
            ...event,
            date: Timestamp.fromDate(new Date(event.date)),
          });
        }
        const newSnapshot = await getDocs(q);
        fetchedEvents = newSnapshot.docs.map(formatEventFromFirestore);
      }
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events from Firestore:', error);
      setEvents(initialEvents.map((e, i) => ({ ...e, id: `local-${i}` })));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // We wait for the AdminContext to be initialized before fetching data
    // to ensure we have the correct user authentication state.
    if (isInitialized) {
      fetchEvents();
    }
  }, [isInitialized, fetchEvents]);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user) throw new Error('You must be logged in to add an event.');
    try {
      const eventDataWithTimestamp = {
        ...event,
        date: Timestamp.fromDate(new Date(event.date)),
      };
      const docRef = await addDoc(collection(db, 'events'), eventDataWithTimestamp);
      // To keep local state consistent, we refetch after adding.
      // This is simpler and more reliable than manually merging.
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      throw error; // Rethrow to be caught by the form's submit handler
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
     if (!user) throw new Error('You must be logged in to update an event.');
    try {
      const { id, ...eventData } = updatedEvent;
      const eventDocRef = doc(db, 'events', id);
      await updateDoc(eventDocRef, {
        ...eventData,
        date: Timestamp.fromDate(new Date(eventData.date)),
      });
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) throw new Error('You must be logged in to delete an event.');
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
