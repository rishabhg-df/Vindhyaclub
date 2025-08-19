
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

// Function to get initial state, trying localStorage first
const getInitialEvents = (): Event[] => {
  if (typeof window === 'undefined') {
    return initialEvents;
  }
  try {
    const storedEvents = localStorage.getItem('vindhya-club-events');
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      // Backwards compatibility check to clear out old data.
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title === 'Club Marathon') {
         localStorage.removeItem('vindhya-club-events');
         return initialEvents;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to parse events from localStorage', error);
  }
  return initialEvents;
};


export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(getInitialEvents);

  useEffect(() => {
    try {
      localStorage.setItem('vindhya-club-events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save events to localStorage', error);
    }
  }, [events]);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [event, ...prevEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
