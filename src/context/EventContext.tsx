
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAdmin } from './AdminContext';
import { format } from 'date-fns';

type EventContextType = {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>, imageFile?: File) => Promise<void>;
  updateEvent: (updatedEvent: Event, imageFile?: File) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loading: boolean;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const formatEventFromFirestore = (docSnap: any): Event => {
  const data = docSnap.data();
  const date =
    data.date instanceof Timestamp
      ? format(data.date.toDate(), 'yyyy-MM-dd')
      : data.date;
  return { id: docSnap.id, ...data, date } as Event;
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

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `events/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addEvent = async (event: Omit<Event, 'id'>, imageFile?: File) => {
    try {
      let imageUrl = event.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const eventDataWithTimestamp = {
        ...event,
        imageUrl: imageUrl || 'https://placehold.co/800x600.png',
        date: Timestamp.fromDate(new Date(event.date)),
      };

      await addDoc(collection(db, 'events'), eventDataWithTimestamp);
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event, imageFile?: File) => {
    try {
      const { id, ...eventData } = updatedEvent;
      const eventRef = doc(db, 'events', id);

      let imageUrl = eventData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const eventDataWithTimestamp = {
        ...eventData,
        imageUrl: imageUrl || 'https://placehold.co/800x600.png',
        date: Timestamp.fromDate(new Date(eventData.date)),
      };
      
      await updateDoc(eventRef, eventDataWithTimestamp);
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
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
