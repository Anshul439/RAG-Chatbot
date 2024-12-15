"use client";

import Image from "next/image";
import logo from "./assets/logo.png";
import { useState } from "react";
import Bubble from "@/components/Bubble";
import PromptSuggestionsRow from "@/components/PromptSuggestionsRow";
import LoadingBubble from "@/components/LoadingBubble";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const noMessages = messages.length === 0;

  const handlePrompt = (promptText) => {
    const newMessage = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add user message to the state
    const newMessage = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the message to the server for response
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

      const assistantMessage = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        assistantMessage, // Add assistant's response
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

    // Clear the input field after submission
    setInput("");
  };

  return (
    <main>
      <Image className="mr-20" src={logo} width={80} alt="logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              The Ultimate place for all things tech! Ask techbot anything about
              tech like the latest technological trends, tech startups, etc, and
              it will come back with the most up-to-date answers. We hope you
              enjoy!
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
}
