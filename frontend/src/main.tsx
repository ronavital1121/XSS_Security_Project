import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { UserProvider } from './contexts/UserContext';
import { NotesProvider } from './contexts/NotesContext'; // Optional if needed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <NotesProvider> {/* Remove this line if you wrap with NotesProvider inside App.tsx */}
        <App />
      </NotesProvider>
    </UserProvider>
  </StrictMode>
);
