import React from 'react';
import { useUser } from '../contexts/UserContext';

const LogoutButton: React.FC = () => {
  const { logout } = useUser(); // get logout function from context

  return (
    <button data-testid="logout" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;
