import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import { UserProvider, useUser } from './contexts/UserContext';
import { NotesProvider } from './contexts/NotesContext';
import { SanitizeProvider } from './contexts/SanitizeContext';

import LoginForm from './components/LoginForm';
import CreateUserForm from './components/CreateUserForm';
import NoteList from './components/NoteList';
import Notification from './components/Notification';
import LogoutButton from './components/LogoutButton';

// Home component conditionally renders UI based on auth token
const Home: React.FC = () => {
  const { token } = useUser();
  const navigate = useNavigate();

  return (
    <NotesProvider>
      <div>
        <h1>Notes Application</h1>
        {!token ? (
          <>
            <Notification />
            <NoteList />
            <button
              data-testid="go_to_login_button"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
            <button
              data-testid="go_to_create_user_button"
              onClick={() => navigate('/create-user')}
            >
              Create New User
            </button>
          </>
        ) : (
          <>
            {/* Use LogoutButton component that handles logout */}
            <LogoutButton />
            <Notification />
            <NoteList />
          </>
        )}
      </div>
    </NotesProvider>
  );
};

const RoutesWithAuth: React.FC = () => {
  const { token } = useUser();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route
        path="/create-user"
        element={token ? <Navigate to="/" /> : <CreateUserForm />}
      />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <SanitizeProvider>
      <Router>
        <RoutesWithAuth />
      </Router>
    </SanitizeProvider>
  </UserProvider>
);

export default App;
