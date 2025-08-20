import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, username, password }),
    });


    if (res.ok) {
      navigate('/');  // Redirect to homepage on success
    } else {
      const err = await res.json();
      setError(err.error || 'Creation failed');
    }
  };

  return (
    <form data-testid="create_user_form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="create_user_form_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          data-testid="create_user_form_email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          data-testid="create_user_form_username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          data-testid="create_user_form_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button
        data-testid="create_user_form_create_user"
        type="submit"
      >
        Create User
      </button>
    </form>
  );
};

export default CreateUserForm;
