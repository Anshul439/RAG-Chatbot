import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';

interface SuggestionProps {
  onPromptSubmit: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  "What is Anshul's work experience?",
  "Tell me about Anshul's technical skills",
  "What projects has Anshul worked on?",
  "What are Anshul's educational qualifications?"
];

const SuggestionPrompt = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 
    text-gray-200 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-200 
    border border-gray-600/30 hover:border-gray-500
    transform hover:-translate-y-0.5 hover:shadow-md sm:hover:shadow-lg"
  >
    <div className="flex items-center space-x-2 sm:space-x-3">
      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300" />
      <span className="text-xs sm:text-sm font-medium">{text}</span>
    </div>
  </button>
);

const SuggestionsSection: React.FC<SuggestionProps> = ({ onPromptSubmit }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-2 sm:px-4">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-8">
        <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
        <h2 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Hi, I'm Anshul's AI Assistant
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <SuggestionPrompt
            key={index}
            text={prompt}
            onClick={() => onPromptSubmit(prompt)}
          />
        ))}
      </div>
      
      <p className="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
        Choose a question or type your own below
      </p>
    </div>
  );
};

export default SuggestionsSection;