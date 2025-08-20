import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { notesReducer, NotesState, NotesAction } from './NotesReducer.tsx';

const initialState: NotesState = {
  notes: [],
  totalPages: 1,
  activePage: 1,
  notification: 'Notification area',
  notesPerPage: 10
};

const NotesStateContext = createContext<NotesState | undefined>(undefined);
const NotesDispatchContext = createContext<React.Dispatch<NotesAction> | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

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
  if (context === undefined) {
    throw new Error('useNotesState must be used within a NotesProvider');
  }
  return context;
};

export const useNotesDispatch = () => {
  const context = useContext(NotesDispatchContext);
  if (context === undefined) {
    throw new Error('useNotesDispatch must be used within a NotesProvider');
  }
  return context;
};
