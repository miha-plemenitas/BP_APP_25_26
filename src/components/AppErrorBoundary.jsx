import React, { Component } from 'react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-shell">
          <section className="panel error-panel">
            <p className="eyebrow">Runtime error</p>
            <h1>Dashboard could not render</h1>
            <p>{this.state.error.message}</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
