import Image from "next/image";
import logo from "./assets/logo.png";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-4xl">
        {/* Header - stays server-rendered */}
        <header className="flex items-center justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-4 p-2 sm:p-4">
          <Image
            src={logo}
            width={40}
            height={40}
            alt="logo"
            className="w-8 h-8 sm:w-10 sm:h-10 transition-transform hover:scale-110"
          />
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
        </header>

        {/* Chat component - client-side */}
        <Chat />
      </div>
    </main>
  );
}