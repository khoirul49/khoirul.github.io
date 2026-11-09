import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faXmark, faPaperPlane, faSpinner, faBrain, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const BOT_NAME = "Khoirul's AI";
const BOT_AVATAR = "🤖";
const WELCOME_MESSAGE = "Halo! Saya asisten AI Khoirul. Tanya saja soal skill, project, pengalaman, atau apa saja yang ingin kamu ketahui tentang portfolio ini. 😊";

// Detect if running on Vite dev server (ports 5173, 5174) where Netlify Functions don't exist
const isViteDev = typeof window !== "undefined" &&
  (window.location.port === "5173" || window.location.port === "5174");

export default function ChatBot() {
  // On Vite dev server, show disabled state
  if (isViteDev) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-400 text-white shadow-xl cursor-not-allowed flex items-center justify-center"
        aria-label="Chatbot disabled in Vite dev mode"
        title="Chatbot tidak aktif di 'npm run dev'. Jalankan 'npx netlify dev' untuk mengaktifkan."
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
      </button>
    );
  }

  return <ChatBotWidget />;
}

function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const addMessage = (role, content) => {
    const newMessage = { role, content, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const raw = await response.text();
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        // bukan JSON (mis. halaman 404 HTML dari Netlify)
      }

      if (!data) {
        throw new Error(
          response.status === 404
            ? "Layanan chat belum aktif di server ini (function tidak ditemukan)."
            : "Respons server tidak valid. Coba lagi nanti."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      addMessage("assistant", data.reply);
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("assistant", `Maaf, terjadi kesalahan: ${err.message} 😅`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setError(null);
  };

  const closeChat = () => setIsOpen(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center"
        onClick={toggleChat}
        aria-label={isOpen ? "Tutup chat" : "Buka chat dengan AI"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        ) : (
          <>
            <FontAwesomeIcon icon={faRobot} className="text-xl animate-bounce" />
            <FontAwesomeIcon
              icon={faBrain}
              className="absolute -bottom-1 -right-1 text-xs text-yellow-300"
            />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-125 md:h-150 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up"
          role="dialog"
          aria-label="Chat dengan AI"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {BOT_AVATAR}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{BOT_NAME}</h3>
              <p className="text-xs opacity-80">Online • Powered by Gemini</p>
            </div>
            <button
              onClick={closeChat}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Tutup chat"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-xs mt-1 block text-right opacity-60 ${
                    msg.role === "user" ? "text-indigo-100" : "text-gray-500"
                  }`}>
                    {msg.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-indigo-600 animate-spin"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Toast */}
          {error && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya apa saja..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                aria-label="Ketik pesan"
                disabled={isLoading}
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
                aria-label="Kirim pesan"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              Data percakapan tidak disimpan permanen • Refresh = reset chat
            </p>
          </form>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={closeChat}
          aria-hidden="true"
        />
      )}
    </>
  );
}