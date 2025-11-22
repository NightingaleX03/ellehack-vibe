import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../src/App';

// Error boundary for web
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff',
          minHeight: '100vh',
        }
      }, [
        React.createElement('h1', { key: 'title', style: { color: '#d32f2f' } }, 'Something went wrong'),
        React.createElement('pre', { key: 'error', style: { whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' } }, this.state.error?.toString() || 'Unknown error'),
        React.createElement('p', { key: 'help' }, 'Check the browser console (F12) for more details.'),
      ]);
    }
    return this.props.children;
  }
}

// For web, we need to render directly
const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      React.createElement(ErrorBoundary, null,
        React.createElement(App)
      )
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Error Loading App</h1>
        <pre style="white-space: pre-wrap;">${error.toString()}</pre>
        <p>Check the browser console (F12) for more details.</p>
      </div>
    `;
  }
} else {
  console.error('Root container (#root) not found in HTML');
}

