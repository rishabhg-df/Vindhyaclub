
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

// Give each initial event a unique ID for session management
const hydratedInitialEvents = initialEvents.map(e => ({...e, id: new Date(e.date).getTime().toString() + Math.random()}));

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Clear old data to ensure the new data source is used.
      // This is a one-time fix.
      const hasCleared = localStorage.getItem('vindhya-club-events-cleared');
      if (!hasCleared) {
          localStorage.removeItem('vindhya-club-events');
          localStorage.setItem('vindhya-club-events-cleared', 'true');
      }

      const storedEvents = localStorage.getItem('vindhya-club-events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // If no stored data, start with the initial data from the file
        setEvents(hydratedInitialEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error('Failed to load events from localStorage', error);
      // Fallback to initial data if localStorage is corrupt or unavailable
      setEvents(hydratedInitialEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setIsInitialized(true);
  }, []);
  
  useEffect(() => {
    // This effect runs only when the component has initialized and events array has changed.
    // It prevents saving the initial empty array to localStorage on first render.
    if (isInitialized) {
      try {
        // We only store text data to avoid quota errors. 
        // Newly added images will not persist on refresh.
        const eventsToStore = events.map(event => {
            const { image, ...rest } = event;
            // Only keep image URL if it's not a base64 string
            const imageToKeep = (typeof image === 'string' && image.startsWith('http')) ? image : 'https://placehold.co/800x600.png';
            return {...rest, image: imageToKeep };
        });
        localStorage.setItem('vindhya-club-events', JSON.stringify(eventsToStore));
      } catch (error) {
        console.error('Failed to save events to localStorage', error);
      }
    }
  }, [events, isInitialized]);

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
  
  if (!isInitialized) {
    return null; // or a loading spinner
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
