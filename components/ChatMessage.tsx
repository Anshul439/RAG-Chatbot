import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const unescapedContent = message.content.replace(/\\n/g, "\n");

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${
        isUser ? "mb-4" : "mb-5"
      }`}
    >
      <div
        className={`max-w-[85%] xs:max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg break-words text-sm sm:text-base ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none ml-4" // Added left margin for user messages
            : "bg-gray-700 text-gray-100 rounded-tl-none mr-4" // Added right margin for bot messages
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{unescapedContent}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-lg sm:text-xl font-bold mt-1 sm:mt-2 mb-1 break-words"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-base sm:text-lg font-bold mt-1 sm:mt-2 mb-1 break-words"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-sm sm:text-base font-bold mt-1 sm:mt-2 mb-1 break-words"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-1 sm:mb-2 leading-snug" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc pl-4 mb-1 sm:mb-2 space-y-0.5"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal pl-4 mb-1 sm:mb-2 space-y-0.5"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-400 hover:text-blue-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="bg-gray-800/70 px-1 py-0.5 rounded text-xs font-mono"
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  className="bg-gray-800/90 p-1 sm:p-2 rounded-md text-xs my-1 sm:my-2 overflow-x-auto"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-2 sm:border-l-4 border-gray-500 pl-2 sm:pl-3 italic text-gray-300 my-1 sm:my-2"
                  {...props}
                />
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
