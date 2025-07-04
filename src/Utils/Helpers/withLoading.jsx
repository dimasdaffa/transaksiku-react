import React from 'react';

const withLoading = (WrappedComponent, LoadingComponent = null) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    const DefaultLoader = () => (
      <div className="flex justify-center items-center py-8 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
    
    const Loader = LoadingComponent || DefaultLoader;
    
    if (isLoading) {
      return <Loader />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default withLoading;