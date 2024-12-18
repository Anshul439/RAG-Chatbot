"use client";

import Image from "next/image";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import logo from "./assets/logo.png";
import ChatMessage from "@/components/ChatMessage";

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

  const noMessages = messages.length === 0;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInput("");

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
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
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <Image src={logo} width={80} alt="logo" className="mb-4" />

      <section
        ref={chatContainerRef}
        className="w-full max-w-3xl flex-grow bg-gray-800 rounded-lg shadow overflow-y-scroll p-4 mb-4"
        style={{ height: "500px" }}
      >
        {noMessages ? (
          <div className="text-center text-gray-400">
            <p>
              Hey! Anshul doesn&apos;t have a portfolio so if you want to know
              about him, you can ask me. I am his assistant.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={`message-${index}`} message={message} />
          ))
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-lg bg-gray-800 rounded-lg shadow p-2 space-x-2"
      >
        <input
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
          className="flex-grow p-2 bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-l focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-600"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </main>
  );
}
