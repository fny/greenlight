import React from 'reactn';
import logger from './logger';

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error: any) {
    logger.error(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    logger.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
