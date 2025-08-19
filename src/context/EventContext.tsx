
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

// Helper to remove base64 image data before saving to localStorage
const getEventsForStorage = (events: Event[]): Event[] => {
  return events.map(event => {
    // If the image is a data URL, replace it with a placeholder or the original URL if available.
    // For this prototype, we'll just not save the new base64 data to avoid quota issues.
    // A real app would upload to a server and get back a URL.
    if (event.image.startsWith('data:image')) {
      // Find the original event to see if we can revert to its image
      const originalEvent = initialEvents.find(e => e.title === event.title); // This is a weak link
      return { ...event, image: originalEvent ? originalEvent.image : 'https://placehold.co/800x600.png' };
    }
    return event;
  });
};


export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('eventData');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // if no data in localstorage, use initial data with unique IDs
        setEvents(initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()})));
      }
    } catch (error) {
      console.error('Failed to parse event data from localStorage', error);
      setEvents(initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()})));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const storableEvents = getEventsForStorage(events);
        localStorage.setItem('eventData', JSON.stringify(storableEvents));
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
