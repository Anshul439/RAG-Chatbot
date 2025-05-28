import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  // First, unescape any escaped newlines
  const unescapedContent = message.content.replace(/\\n/g, '\n');

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xl p-4 rounded-lg break-words ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-gray-700 text-gray-100 rounded-tl-none"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
            {unescapedContent}
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold mt-4 mb-2 break-words overflow-wrap-anywhere" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-bold mt-3 mb-2 break-words overflow-wrap-anywhere" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold mt-3 mb-2 break-words overflow-wrap-anywhere" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-3 leading-relaxed break-words overflow-wrap-anywhere" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1 break-words overflow-wrap-anywhere" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1 break-words overflow-wrap-anywhere" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-1 break-words overflow-wrap-anywhere" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold break-words overflow-wrap-anywhere" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic break-words overflow-wrap-anywhere" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a 
                  className="text-blue-400 hover:text-blue-300 underline break-words overflow-wrap-anywhere" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  {...props} 
                />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-800/70 px-1.5 py-0.5 rounded text-sm font-mono break-words overflow-wrap-anywhere" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-800/90 p-3 rounded-md text-sm my-3 whitespace-pre-wrap break-words overflow-wrap-anywhere" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 my-3 break-words overflow-wrap-anywhere" {...props} />
              ),
            }}
          >
            {unescapedContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}