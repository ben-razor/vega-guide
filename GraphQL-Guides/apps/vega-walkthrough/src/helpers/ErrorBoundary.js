import React from "react";
class SyntaxErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log('boo', error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return 'There was a syntax error in your query.';
    }
    else {
      return this.props.children;
    }
  }
}

export {SyntaxErrorBoundary};