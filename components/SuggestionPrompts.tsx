import React from 'react';

const SuggestionPrompt = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors"
  >
    {text}
  </button>
);

export default SuggestionPrompt;