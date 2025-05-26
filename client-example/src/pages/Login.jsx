import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const errorDialogRef = useRef(null);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorText('');
  };

  const showError = (msg) => {
    setErrorText(msg);
    if (errorDialogRef.current) {
      errorDialogRef.current.showModal();
    }
  };

  const closeErrorDialog = () => {
    if (errorDialogRef.current) {
      errorDialogRef.current.close();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? 'http://localhost:3000/auth'
      : 'http://localhost:3000/users';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard'); 
      } else {
        if (isLogin) {
          showError('⚠️ Invalid email or password. Please try again.');
        } else {
          showError('⚠️ Registration failed. The email may already be in use or data is invalid.');
        }
      }
    } catch {
      showError('⚠️ Network error. Please try again later.');
    }
  };

  // Styles converted from your CSS
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      backgroundColor: '#f0f2f5',
    },
    container: {
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    toggleLink: {
      display: 'block',
      marginTop: '1rem',
      textAlign: 'center',
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    dialog: {
      borderRadius: '8px',
      border: '1px solid #ddd',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    dialogButton: {
      width: 'auto',
      marginTop: '1rem',
      padding: '0.5rem 1rem',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" style={styles.button}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        <span onClick={toggleMode} style={styles.toggleLink} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') toggleMode(); }}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </span>
      </div>

      <dialog ref={errorDialogRef} style={styles.dialog}>
        <p>{errorText}</p>
        <button onClick={closeErrorDialog} style={styles.dialogButton}>
          Close
        </button>
      </dialog>
    </div>
  );
}
