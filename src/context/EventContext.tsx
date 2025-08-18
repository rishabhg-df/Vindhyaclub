
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Event } from '@/lib/types';
import { events as initialEvents } from '@/lib/data';

type EventContextType = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (id: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const staticEvents = initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()}));

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('eventData');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // if no data in localstorage, use initial data
        setEvents(staticEvents);
      }
    } catch (error) {
      console.error('Failed to parse event data from localStorage', error);
      setEvents(staticEvents);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('eventData', JSON.stringify(events));
      } catch (error) {
        console.error('Failed to save event data to localStorage', error);
      }
    }
  }, [events, isInitialized]);
  

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
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
