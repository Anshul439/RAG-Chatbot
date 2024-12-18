export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg text-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-200 text-black rounded-tl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
