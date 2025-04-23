import React from 'react';

const LoginButton = ({ type = 'button', onClick, children, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default LoginButton; 