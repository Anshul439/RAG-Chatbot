import React from 'react';

const LoadingMessage = () => {
  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-xs p-3 rounded-lg text-sm bg-gray-200 text-black rounded-tl-none">
        <div className="flex space-x-2 h-4 items-center">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;