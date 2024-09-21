import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className='min-h-screen flex justify-center items-center text-xl font-semibold'>Sorry... there was an error!</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
