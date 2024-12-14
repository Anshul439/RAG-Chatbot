"use client";

import Image from "next/image";
import logo from "./assets/logo.png";
import { useChat } from "ai/react";
import { Message } from "ai";
import PromptSuggestionsRow from "@/components/PromptSuggestionsRow";
import LoadingBubble from "@/components/LoadingBubble";

export default function Home() {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  return (
    <main>
      <Image className="mr-20" src={logo} width={80} alt="logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="text-white">
              The Ultimate place for all things tech! Ask techbot anything about
              tech like the latest technological trends, tech startups, etc, and
              it will come back with the most up-to-date answers. We hope you
              enjoy!
            </p>
            <br />
            {<PromptSuggestionsRow onPromptClick={handlePrompt} />}
          </>
        ) : (
          <>
            {messages}
            {isLoading && <LoadingBubble />}
          </>
        )}
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleInputChange}
            value={input}
            placeholder="Ask me something..."
          />
          <input type="submit" />
        </form>
      </section>
    </main>
  );
}
