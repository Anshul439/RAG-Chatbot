import React from 'react';

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Split content on escaped newlines and create formatted content
  const formattedContent = message.content.split('\\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.content.split('\\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs p-3 rounded-lg text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-200 text-black rounded-tl-none"
        }`}
      >
        {formattedContent}
      </div>
    </div>
  );
}