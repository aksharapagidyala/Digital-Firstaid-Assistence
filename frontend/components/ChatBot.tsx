import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Heart, Sparkles } from "lucide-react";
import { chatWithAI } from "../geminiService";

type Message = {
  role: "user" | "bot";
  text: string;
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I am your AI First Aid Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await chatWithAI(userMsg, []);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botResponse || "Sorry, I can't help right now.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">First Aid AI</span>
                <span className="text-[10px] opacity-80 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 border rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-2xl outline-none text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl hover:scale-105 transition"
        >
          <div className="relative">
            <Bot className="w-8 h-8" />
            <Heart className="w-3 h-3 text-red-500 fill-red-500 absolute -top-1 -right-1" />
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
