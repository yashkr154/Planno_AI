import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Task, Expense, Guest, Venue, Vendor, AIEventBlueprint } from '../types';
import { INITIAL_EVENTS, INITIAL_TASKS, INITIAL_EXPENSES, INITIAL_GUESTS, INITIAL_VENUES, INITIAL_VENDORS } from '../lib/demoData';
import { generateToken } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

interface EventContextType {
  events: Event[];
  activeEvent: Event | null;
  tasks: Task[];
  expenses: Expense[];
  guests: Guest[];
  venues: Venue[];
  vendors: Vendor[];
  setActiveEventId: (id: string) => void;
  createEventFromBlueprint: (blueprint: AIEventBlueprint, date: string, location: string, city: string) => Event;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Event;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addGuest: (guest: Omit<Guest, 'id' | 'qrToken' | 'invitationSent'>) => void;
  updateGuestRSVP: (id: string, status: 'attending' | 'declined' | 'pending') => void;
  deleteGuest: (id: string) => void;
  sendGuestInvitation: (guestId: string) => void;
  addVenue: (venue: Omit<Venue, 'id'>) => Venue;
  getEventMetrics: (eventId: string) => {
    totalBudget: number;
    estimatedCost: number;
    actualCost: number;
    disbursed: number;
    outstanding: number;
    remainingBuffer: number;
    percentSpent: number;
    totalGuests: number;
    attendingGuests: number;
    pendingTasksCount: number;
  };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser } = useAuth();

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('plannoai_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [activeEventId, setActiveEventIdState] = useState<string>(() => {
    const saved = localStorage.getItem('plannoai_active_event_id');
    return saved || INITIAL_EVENTS[0].id;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('plannoai_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('plannoai_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('plannoai_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem('plannoai_venues');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);

  useEffect(() => {
    localStorage.setItem('plannoai_venues', JSON.stringify(venues));
  }, [venues]);

  // Firestore Realtime Subscription when Firebase user logged in
  useEffect(() => {
    if (!firebaseUser) return;

    const currentUserId = firebaseUser.uid;

    // Listen to Events
    const eventsQuery = query(collection(db, 'events'), where('userId', '==', currentUserId));
    const unsubEvents = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const loadedEvents: Event[] = [];
        snapshot.forEach((docSnap) => {
          loadedEvents.push(docSnap.data() as Event);
        });
        if (loadedEvents.length > 0) {
          setEvents(loadedEvents);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'events')
    );

    // Listen to Tasks
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', currentUserId));
    const unsubTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loadedTasks: Task[] = [];
        snapshot.forEach((docSnap) => {
          loadedTasks.push(docSnap.data() as Task);
        });
        if (loadedTasks.length > 0) {
          setTasks(loadedTasks);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'tasks')
    );

    // Listen to Expenses
    const expensesQuery = query(collection(db, 'expenses'), where('userId', '==', currentUserId));
    const unsubExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const loadedExpenses: Expense[] = [];
        snapshot.forEach((docSnap) => {
          loadedExpenses.push(docSnap.data() as Expense);
        });
        if (loadedExpenses.length > 0) {
          setExpenses(loadedExpenses);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'expenses')
    );

    // Listen to Guests
    const guestsQuery = query(collection(db, 'guests'), where('userId', '==', currentUserId));
    const unsubGuests = onSnapshot(
      guestsQuery,
      (snapshot) => {
        const loadedGuests: Guest[] = [];
        snapshot.forEach((docSnap) => {
          loadedGuests.push(docSnap.data() as Guest);
        });
        if (loadedGuests.length > 0) {
          setGuests(loadedGuests);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'guests')
    );

    return () => {
      unsubEvents();
      unsubTasks();
      unsubExpenses();
      unsubGuests();
    };
  }, [firebaseUser]);

  // Local Storage backups
  useEffect(() => {
    localStorage.setItem('plannoai_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('plannoai_active_event_id', activeEventId);
  }, [activeEventId]);

  useEffect(() => {
    localStorage.setItem('plannoai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('plannoai_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('plannoai_guests', JSON.stringify(guests));
  }, [guests]);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || null;

  const setActiveEventId = (id: string) => {
    setActiveEventIdState(id);
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>): Event => {
    const newEventId = 'evt-' + Date.now();
    const currentUserId = firebaseUser?.uid || user?.id || 'usr-1';

    const newEvent: Event = {
      ...eventData,
      id: newEventId,
      createdAt: new Date().toISOString().split('T')[0],
      disbursedAmount: eventData.disbursedAmount || 0,
      outstandingAmount: eventData.outstandingAmount || 0,
      currency: eventData.currency || 'INR',
    };

    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventIdState(newEventId);

    if (firebaseUser) {
      setDoc(doc(db, 'events', newEventId), { ...newEvent, userId: currentUserId }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `events/${newEventId}`)
      );
    }

    return newEvent;
  };

  const createEventFromBlueprint = (
    blueprint: AIEventBlueprint,
    date: string,
    location: string,
    city: string
  ): Event => {
    const newEventId = 'evt-' + Date.now();
    const currentUserId = firebaseUser?.uid || user?.id || 'usr-1';
    const estCost = blueprint.estimatedExpenses.reduce((sum, e) => sum + e.estimatedAmount, 0);

    const newEvent: Event = {
      id: newEventId,
      title: blueprint.title,
      type: blueprint.type,
      description: blueprint.decorConcept.description,
      date: date || '2026-11-20',
      time: '10:00 AM',
      location: location || 'Selected Venue',
      city: city || 'Vadodara',
      guestCount: blueprint.estimatedGuests || 200,
      budget: blueprint.suggestedBudget || 1000000,
      estimatedCost: estCost || Math.round(blueprint.suggestedBudget * 0.9),
      actualCost: 0,
      disbursedAmount: 0,
      outstandingAmount: estCost,
      status: 'planning',
      theme: blueprint.theme,
      createdAt: new Date().toISOString().split('T')[0],
      currency: 'INR',
    };

    const newTasks: Task[] = blueprint.recommendedTasks.map((t, i) => ({
      id: `t-${Date.now()}-${i}`,
      eventId: newEventId,
      title: t.title,
      category: t.category,
      dueDate: date || '2026-11-15',
      completed: false,
      priority: t.priority,
      assignedTo: 'Event Manager',
    }));

    const newExpenses: Expense[] = blueprint.estimatedExpenses.map((e, i) => ({
      id: `exp-${Date.now()}-${i}`,
      eventId: newEventId,
      category: e.category,
      description: e.description,
      estimatedAmount: e.estimatedAmount,
      actualAmount: e.estimatedAmount,
      paidAmount: 0,
      status: 'planned',
    }));

    setEvents((prev) => [newEvent, ...prev]);
    setTasks((prev) => [...newTasks, ...prev]);
    setExpenses((prev) => [...newExpenses, ...prev]);
    setActiveEventIdState(newEventId);

    if (firebaseUser) {
      setDoc(doc(db, 'events', newEventId), { ...newEvent, userId: currentUserId }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `events/${newEventId}`)
      );
      newTasks.forEach((t) =>
        setDoc(doc(db, 'tasks', t.id), { ...t, userId: currentUserId }).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `tasks/${t.id}`)
        )
      );
      newExpenses.forEach((exp) =>
        setDoc(doc(db, 'expenses', exp.id), { ...exp, userId: currentUserId }).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `expenses/${exp.id}`)
        )
      );
    }

    return newEvent;
  };

  const updateEvent = (id: string, data: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    if (firebaseUser) {
      const current = events.find((e) => e.id === id);
      if (current) {
        const updated = { ...current, ...data };
        setDoc(doc(db, 'events', id), updated, { merge: true }).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `events/${id}`)
        );
      }
    }
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (firebaseUser) {
      deleteDoc(doc(db, 'events', id)).catch((err) => handleFirestoreError(err, OperationType.DELETE, `events/${id}`));
    }
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTaskId = 't-' + Date.now();
    const currentUserId = firebaseUser?.uid || user?.id || 'usr-1';
    const newTask: Task = { ...taskData, id: newTaskId };

    setTasks((prev) => [newTask, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'tasks', newTaskId), { ...newTask, userId: currentUserId }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `tasks/${newTaskId}`)
      );
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, completed: !t.completed };
          if (firebaseUser) {
            setDoc(doc(db, 'tasks', id), { completed: updated.completed }, { merge: true }).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `tasks/${id}`)
            );
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (firebaseUser) {
      deleteDoc(doc(db, 'tasks', id)).catch((err) => handleFirestoreError(err, OperationType.DELETE, `tasks/${id}`));
    }
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpId = 'exp-' + Date.now();
    const currentUserId = firebaseUser?.uid || user?.id || 'usr-1';
    const newExp: Expense = { ...expenseData, id: newExpId };

    setExpenses((prev) => [newExp, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'expenses', newExpId), { ...newExp, userId: currentUserId }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `expenses/${newExpId}`)
      );
    }
  };

  const updateExpense = (id: string, data: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    if (firebaseUser) {
      setDoc(doc(db, 'expenses', id), data, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `expenses/${id}`)
      );
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (firebaseUser) {
      deleteDoc(doc(db, 'expenses', id)).catch((err) => handleFirestoreError(err, OperationType.DELETE, `expenses/${id}`));
    }
  };

  const addGuest = (guestData: Omit<Guest, 'id' | 'qrToken' | 'invitationSent'>) => {
    const newGuestId = 'g-' + Date.now();
    const currentUserId = firebaseUser?.uid || user?.id || 'usr-1';
    const newGuest: Guest = {
      ...guestData,
      id: newGuestId,
      qrToken: generateToken(),
      invitationSent: false,
    };

    setGuests((prev) => [newGuest, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'guests', newGuestId), { ...newGuest, userId: currentUserId }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `guests/${newGuestId}`)
      );
    }
  };

  const updateGuestRSVP = (id: string, status: 'attending' | 'declined' | 'pending') => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, rsvpStatus: status };
          if (firebaseUser) {
            setDoc(doc(db, 'guests', id), { rsvpStatus: status }, { merge: true }).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `guests/${id}`)
            );
          }
          return updated;
        }
        return g;
      })
    );
  };

  const deleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    if (firebaseUser) {
      deleteDoc(doc(db, 'guests', id)).catch((err) => handleFirestoreError(err, OperationType.DELETE, `guests/${id}`));
    }
  };

  const sendGuestInvitation = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          const updated = { ...g, invitationSent: true };
          if (firebaseUser) {
            setDoc(doc(db, 'guests', guestId), { invitationSent: true }, { merge: true }).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `guests/${guestId}`)
            );
          }
          return updated;
        }
        return g;
      })
    );
  };

  const addVenue = (venueData: Omit<Venue, 'id'>): Venue => {
    const newVenueId = 'v-' + Date.now();
    const newVenue: Venue = { ...venueData, id: newVenueId };

    setVenues((prev) => [newVenue, ...prev]);
    return newVenue;
  };

  const getEventMetrics = (eventId: string) => {
    const currentEvent = events.find((e) => e.id === eventId);
    const eventExpenses = expenses.filter((e) => e.eventId === eventId);
    const eventTasks = tasks.filter((t) => t.eventId === eventId);
    const eventGuests = guests.filter((g) => g.eventId === eventId);

    const totalBudget = currentEvent ? currentEvent.budget : 0;
    const estimatedCost = eventExpenses.reduce((sum, e) => sum + e.estimatedAmount, 0);
    const actualCost = eventExpenses.reduce((sum, e) => sum + (e.actualAmount || e.estimatedAmount), 0);
    const disbursed = eventExpenses.reduce((sum, e) => sum + e.paidAmount, 0);
    const outstanding = Math.max(0, actualCost - disbursed);
    const remainingBuffer = totalBudget - actualCost;
    const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((actualCost / totalBudget) * 100)) : 0;

    const totalGuests = eventGuests.length;
    const attendingGuests = eventGuests.filter((g) => g.rsvpStatus === 'attending').length;
    const pendingTasksCount = eventTasks.filter((t) => !t.completed).length;

    return {
      totalBudget,
      estimatedCost,
      actualCost,
      disbursed,
      outstanding,
      remainingBuffer,
      percentSpent,
      totalGuests,
      attendingGuests,
      pendingTasksCount,
    };
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        tasks,
        expenses,
        guests,
        venues,
        vendors,
        setActiveEventId,
        createEventFromBlueprint,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        toggleTask,
        deleteTask,
        addExpense,
        updateExpense,
        deleteExpense,
        addGuest,
        updateGuestRSVP,
        deleteGuest,
        sendGuestInvitation,
        addVenue,
        getEventMetrics,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
