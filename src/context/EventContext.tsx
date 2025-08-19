'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

type EventContextType = {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (updatedEvent: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loading: boolean;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const formatEventDate = (event: any): Event => {
    const data = event.data();
    if (data.date instanceof Timestamp) {
        // format to YYYY-MM-DD string
        data.date = format(data.date.toDate(), 'yyyy-MM-dd');
    }
    return { id: event.id, ...data } as Event;
};


export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      let fetchedEvents: Event[] = querySnapshot.docs.map(formatEventDate);

      // Populate Firestore with seed data if empty
      if (fetchedEvents.length === 0 && initialEvents.length > 0) {
        const initialDataPromises = initialEvents.map((event) =>
          addDoc(collection(db, 'events'), {
            ...event,
            date: Timestamp.fromDate(new Date(event.date))
          })
        );
        await Promise.all(initialDataPromises);

        const newSnapshot = await getDocs(q);
        fetchedEvents = newSnapshot.docs.map(formatEventDate);
      }

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events from Firestore:', error);
      // fallback to local seed data
      setEvents(initialEvents.map((e, i) => ({ ...e, id: `local-${i}` })));
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
      const eventDataWithTimestamp = {
        ...event,
        date: Timestamp.fromDate(new Date(event.date)),
      };
      const docRef = await addDoc(collection(db, 'events'), eventDataWithTimestamp);
      const newEvent: Event = { id: docRef.id, ...event };
      setEvents((prev) =>
        [...prev, newEvent].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const { id, ...eventData } = updatedEvent; // strip out id
      const eventDoc = doc(db, 'events', id);
      await updateDoc(eventDoc, {
        ...eventData,
        date: Timestamp.fromDate(new Date(eventData.date)),
      });

      setEvents((prev) =>
        prev
          .map((ev) => (ev.id === id ? updatedEvent : ev))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      );
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
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
