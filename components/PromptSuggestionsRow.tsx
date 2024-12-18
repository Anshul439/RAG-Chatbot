import React from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({onPromptClick}) => {
  const promtps = [
    "What are the most in-demand tech skills for 2024?",
    "How are emerging SaaS products changing the landscape of remote work?",
    "What are the trending AI startups right now?",
    "What’s new in augmented and virtual reality?",
  ];

  return (
    <div>
      {promtps.map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
