import React, { Component } from 'react';
import Card from './Card';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4">
          <Card className="bg-red-50">
            <div className="text-center p-6">
              <div className="bg-red-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
              <p className="text-gray-600 mb-6">
                Maaf, terjadi kesalahan pada aplikasi. Tim teknis kami telah diberitahu dan sedang memperbaikinya.
              </p>
              
              {this.props.showDetails && (
                <div className="mb-4 p-3 bg-gray-100 rounded text-left overflow-x-auto">
                  <p className="font-mono text-sm text-red-600">{this.state.error && this.state.error.toString()}</p>
                  <details className="mt-2">
                    <summary className="text-sm text-gray-700 cursor-pointer">Detail Teknis</summary>
                    <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Muat Ulang Halaman
                </button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;