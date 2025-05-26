import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Change if backend URL differs

export default function Editor() {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const socketRef = useRef(null);
  const outputRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const scriptId = queryParams.get('id')
  const token = localStorage.getItem('authToken') || '';

  useEffect(() => {
    // Load script content if scriptId is provided
    if (scriptId) {
      loadScript();
    }
    
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
        auth: {
            token: token
        }
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      addOutput({ type: 'error', data: 'Connection error' });
    });

    socketRef.current.on('scriptOutput', (data) => {
      addOutput({ type: data.type, data: data.data });
    });

    socketRef.current.on('scriptSaved', () => {
      addOutput({ type: 'info', data: 'Script saved' });
    });

    socketRef.current.on('scriptError', (data) => {
      addOutput({ type: 'error', data: data.message });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Helper to add output line and scroll down
  const addOutput = (line) => {
    setOutput((prev) => [...prev, line]);
    // Scroll handled in useEffect below
  };

  // Scroll output div to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSave = () => {
    socketRef.current.emit('saveScript', {
      id: scriptId,
      content: code,
    });
    addOutput({ type: 'info', data: '[Guardado]' });
  };

  const handleRun = () => {
    setOutput([]); // Clear output
    socketRef.current.emit('runScript', {
      id: scriptId,
      language: language,
    });
  };

  const loadScript = async () => {
    try {
      const response = await fetch(`http://localhost:3000/scripts/${scriptId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLanguage(data.language);
        setCode(data.content);
      } else {
        addOutput({ type: 'error', data: 'Error fetching script' });
      }
    } catch (error) {
      addOutput({ type: 'error', data: 'Network error' });
    }
  }

  // Simple styles from your CSS, converted to JS objects
  const styles = {
    container: { fontFamily: 'sans-serif', margin: '2em' },
    textarea: { width: '100%', height: 200 },
    output: {
      background: '#111',
      color: '#0f0',
      padding: '1em',
      height: 150,
      overflowY: 'auto',
      marginTop: '1em',
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
      fontSize: '0.9rem',
    },
    label: { display: 'block', marginBottom: '0.5em' },
    select: { marginLeft: '0.5em' },
    button: {
      marginRight: '0.5em',
      padding: '0.5em 1em',
      cursor: 'pointer',
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Editor de Código - Prueba</h1>
      <textarea
        id="code"
        placeholder="Escribe tu código aquí..."
        style={styles.textarea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button id="saveBtn" onClick={handleSave} style={styles.button}>
        Guardar
      </button>
      <button id="runBtn" onClick={handleRun} style={styles.button}>
        Ejecutar
      </button>
      <h2>Salida:</h2>
      <div id="output" style={styles.output} ref={outputRef}>
        {output.map((line, idx) => {
          let color = '#0f0'; // default green
          if (line.type === 'error') color = '#f00';
          else if (line.type === 'info') color = '#0af';
          return (
            <div key={idx} style={{ color }}>
              [{line.type}] {line.data}
            </div>
          );
        })}
      </div>
    </div>
  );
}
