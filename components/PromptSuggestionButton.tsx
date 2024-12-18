import React from "react";

const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
