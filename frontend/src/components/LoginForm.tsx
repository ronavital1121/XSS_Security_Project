import React, { useState,useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';


const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setToken, setUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    setUsername('');
    setPassword('');
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Login failed');
        return;
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      navigate('/');

    } catch (err) {
      console.error('Login failed:', err);
      setError('Network error');
    }
  };

  return (
    <form data-testid="login_form" onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          data-testid="login_form_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          data-testid="login_form_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button data-testid="login_form_login" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
