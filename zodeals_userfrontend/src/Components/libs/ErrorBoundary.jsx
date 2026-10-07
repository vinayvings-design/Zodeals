import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary caught error]', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.showError || this.props.debug) {
        return (
          <div style={{
            padding: 24, fontFamily: 'Inter, sans-serif',
            background: '#FFF5F5', border: '1px solid #FECACA',
            borderRadius: 12, margin: 16,
          }}>
            <strong style={{ color: '#C62828' }}>
              ⚠️ {this.props.label || 'Section'} crashed:
            </strong>
            <pre style={{
              background: '#FEE2E2', padding: 12, borderRadius: 8,
              fontSize: 12, color: '#7F1D1D', marginTop: 8,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word'
            }}>
              {this.state.error?.message}
            </pre>
          </div>
        );
      }
      // Silent hide for non-debug boundaries
      return null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
