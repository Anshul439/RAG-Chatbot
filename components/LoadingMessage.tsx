import React from 'react';

const LoadingMessage = () => {
  return (
    <div className="flex justify-start mb-3 mr-4"> {/* Added mr-4 to match bot messages */}
      <div className="max-w-[85%] xs:max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg bg-gray-700 text-gray-100 rounded-tl-none">
        <div className="flex space-x-1 h-3 items-center">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;