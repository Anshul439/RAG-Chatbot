'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { Send, Loader2 } from "lucide-react";
import logo from "./assets/logo.png";
import ChatMessage from "@/components/ChatMessage";
import LoadingMessage from "@/components/LoadingMessage";
import SuggestionsSection from "@/components/SuggestionsSection";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "inherit";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    setInput("");
    event.preventDefault();
    await sendMessage(input);
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
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4">
      <div className="w-full max-w-4xl flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-center space-x-4 mb-4 p-4">
          <Image
            src={logo}
            width={48}
            height={48}
            alt="logo"
            className="transition-transform hover:scale-110"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
        </header>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-grow bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto mb-4 p-4 transition-all
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-800/20
            [&::-webkit-scrollbar-thumb]:bg-blue-700/40
            [&::-webkit-scrollbar-thumb:hover]:bg-blue-600/60
            hover:[&::-webkit-scrollbar-thumb]:bg-blue-600/50"
        >
          {messages.length === 0 ? (
            <SuggestionsSection onPromptSubmit={sendMessage} />
          ) : (
            <div className="space-y-4">
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
          className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 bg-gray-700/50 text-gray-100 placeholder-gray-400 
              border border-gray-600 rounded-lg resize-none min-h-[52px] max-h-[200px]
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
              transition-all duration-200"
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-6 bottom-6 p-2 text-blue-400 hover:text-blue-300 
              disabled:text-gray-500 transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
