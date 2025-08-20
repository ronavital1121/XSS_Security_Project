import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// --- Types ---
// types.ts
interface User {
  _id: string;
  name: string;
  email: string;
} 

export interface Author {
  name: string;
  email: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  user?: User;
  author: Author | null;  
}


export type NotesState = {
  notes: Note[];
  totalPages: number;
  activePage: number;
  notification: string;
  notesPerPage: number;
};

export type NotesAction =
  | { type: 'SET_NOTES'; payload: { notes: Note[]; total: number } }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_NOTIFICATION'; payload: string }
  | { type: 'DELETE_NOTE_FAILED'; payload: string }
  | { type: 'SET_ACTIVE_PAGE'; payload: number };

// --- Reducer ---
export const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload.notes,
        totalPages: Math.ceil(action.payload.total / state.notesPerPage),
      };

    case 'ADD_NOTE':
      return {
          ...state,
        notes: [action.payload, ...state.notes],
        activePage: 1,               
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
        note._id === action.payload._id ? action.payload : note
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };

    case 'DELETE_NOTE_FAILED':
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload,
      };

    case 'SET_ACTIVE_PAGE':
      return {
        ...state,
        activePage: action.payload,
      };

    default:
      return state;
  }
};

const NotesStateContext = createContext<NotesState | undefined>(undefined);
const NotesDispatchContext = createContext<React.Dispatch<NotesAction> | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    totalPages: 1,
    activePage: 1,
    notification: 'Notification area',
    notesPerPage: 10,
  });

  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
};

export const useNotesState = () => {
  const context = useContext(NotesStateContext);
  if (!context) {
    throw new Error('useNotesState must be used within a NotesProvider');
  }
  return context;
};

export const useNotesDispatch = () => {
  const context = useContext(NotesDispatchContext);
  if (!context) {
    throw new Error('useNotesDispatch must be used within a NotesProvider');
  }
  return context;
};
