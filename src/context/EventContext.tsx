
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

const getInitialEvents = (): Event[] => {
  if (typeof window !== 'undefined') {
    try {
      const storedEvents = localStorage.getItem('eventData');
      if (storedEvents) {
        return JSON.parse(storedEvents);
      }
    } catch (error) {
      console.error('Failed to parse event data from localStorage', error);
      // Fallback to initialEvents if localStorage is corrupt
      return initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString()}));
    }
  }
  return initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString()}));
};


export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(getInitialEvents);

  useEffect(() => {
    try {
      localStorage.setItem('eventData', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save event data to localStorage', error);
    }
  }, [events]);
  

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
