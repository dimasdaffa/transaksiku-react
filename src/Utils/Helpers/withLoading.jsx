import React from 'react';

// Higher-Order Component to handle loading states
const withLoading = (WrappedComponent, LoadingComponent = null) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    // Default loading component if none provided
    const DefaultLoader = () => (
      <div className="flex justify-center items-center py-8 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
    
    // Use provided loading component or default
    const Loader = LoadingComponent || DefaultLoader;
    
    // Render loading component if isLoading is true, otherwise render the wrapped component
    if (isLoading) {
      return <Loader />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default withLoading;