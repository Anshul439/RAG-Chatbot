"use client";

import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { Send, Loader2 } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LoadingMessage from "@/components/LoadingMessage";
import SuggestionsSection from "@/components/SuggestionsSection";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "inherit";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: messageContent,
      role: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server");
      }

      const assistantMessage: Message = await response.json();
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");
    await sendMessage(currentInput);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="w-full flex flex-col"
      style={{ height: "calc(100vh - 120px)" }}
    >
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-grow bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto mb-2 sm:mb-4 p-2 sm:p-4 transition-all
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-800/20
          [&::-webkit-scrollbar-thumb]:bg-blue-700/40
          [&::-webkit-scrollbar-thumb:hover]:bg-blue-600/60
          hover:[&::-webkit-scrollbar-thumb]:bg-blue-600/50"
      >
        {messages.length === 0 ? (
          <SuggestionsSection onPromptSubmit={sendMessage} />
        ) : (
          <div className="space-y-2 sm:space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || `fallback-key-${index}`}
                message={message}
              />
            ))}
            {isLoading && <LoadingMessage />}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-4"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={
            isLoading
              ? "Please wait for the response..."
              : "Type your message..."
          }
          disabled={isLoading}
          className={`w-full px-3 py-2 pr-10 bg-gray-700/50 text-gray-100 placeholder-gray-400 
    border border-gray-600 rounded-lg resize-none min-h-[44px] max-h-[150px] text-sm sm:text-base
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
    transition-all duration-200 break-words overflow-wrap-anywhere
    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          rows={1}
        />
<button
  type="submit"
  disabled={isLoading || !input.trim()}
  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 text-blue-400 hover:text-blue-300 
    disabled:text-gray-500 transition-colors duration-200"
>
  {isLoading ? (
    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
  ) : (
    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
  )}
</button>
      </form>
    </div>
  );
}
