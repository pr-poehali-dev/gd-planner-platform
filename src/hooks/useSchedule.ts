import { useState, useEffect } from 'react';
import { ScheduleEvent, ResponsiblePerson } from '@/types/schedule';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/cd6aa895-a89e-481c-923d-0305447f1058';

export const useSchedule = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [persons, setPersons] = useState<ResponsiblePerson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Не удалось загрузить события');
    }
  };

  const loadPersons = async () => {
    try {
      const response = await fetch(`${API_URL}/persons`);
      const data = await response.json();
      if (data.persons) {
        setPersons(data.persons);
      }
    } catch (error) {
      console.error('Failed to load persons:', error);
      toast.error('Не удалось загрузить ответственных лиц');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadEvents(), loadPersons()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addEvent = async (event: Partial<ScheduleEvent>) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      if (response.ok) {
        await loadEvents();
        return data.id;
      }
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error('Не удалось добавить событие');
    }
  };

  const updateEvent = async (event: ScheduleEvent) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (response.ok) {
        await loadEvents();
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Не удалось обновить событие');
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/events?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await loadEvents();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Не удалось удалить событие');
    }
  };

  const addPerson = async (person: Partial<ResponsiblePerson>) => {
    try {
      const response = await fetch(`${API_URL}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });
      const data = await response.json();
      if (response.ok) {
        await loadPersons();
        return data.id;
      }
    } catch (error) {
      console.error('Failed to add person:', error);
      toast.error('Не удалось добавить ответственное лицо');
    }
  };

  const deletePerson = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/persons?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await loadPersons();
      }
    } catch (error) {
      console.error('Failed to delete person:', error);
      toast.error('Не удалось удалить ответственное лицо');
    }
  };

  return {
    events,
    persons,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    addPerson,
    deletePerson,
  };
};
