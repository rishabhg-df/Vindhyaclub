
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

// Helper function to safely get data from localStorage
const getInitialEventState = (): Event[] => {
    try {
      const item = window.localStorage.getItem('events');
      // Parse stored json or if none return initial data
      const events = item ? JSON.parse(item) : initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()}));
      // Sort by date descending
      return events.sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.warn(`Error reading events from localStorage`, error);
      return initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()})).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(getInitialEventState);

  // Save to localStorage whenever the events state changes.
  useEffect(() => {
    try {
      // When saving, create a version of the data that does not include the large image strings
      // for any items that were added by the user.
      const eventsToStore = events.map(event => {
        const { ...eventWithoutImage } = event;
        if (event.image.startsWith('data:image')) {
          (eventWithoutImage as Partial<Event>).image = 'https://placehold.co/800x600.png'; // Replace with placeholder on store
        }
        return eventWithoutImage;
      });
      window.localStorage.setItem('events', JSON.stringify(eventsToStore));
    } catch (error) {
      console.warn(`Error saving events to localStorage`, error);
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
