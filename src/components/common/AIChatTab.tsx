import { useState, useRef, useEffect, useCallback } from 'react';
import { askPhysicsTutor, type Message } from '@/services/gemini';

interface AIChatTabProps {
  chapterTitle: string;
}

export const AIChatTab = ({ chapterTitle }: AIChatTabProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "Explain the main formula",
    "What's a common JEE trap here?",
    "Give me a 1-line summary"
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askPhysicsTutor(text, chapterTitle, messages);
      const aiMsg: Message = { role: 'model', text: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      // askPhysicsTutor handles errors internally and returns a string, 
      // but we catch any unexpected catastrophic failures.
    } finally {
      setIsLoading(false);
    }
  }, [chapterTitle, messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-l border-slate-800">
      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-4 bg-sky-500/10 rounded-full">
              <span className="text-4xl">⚛️</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-slate-200">Ask anything about {chapterTitle}</h3>
              <p className="text-slate-400 text-sm">Your JEE/NEET physics tutor is ready.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}
              >
                <div 
                  className={`px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-sky-500/20 border border-sky-500/30 text-sky-50 rounded-tl-2xl rounded-bl-2xl rounded-tr-sm' 
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tr-2xl rounded-br-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'model' && <span className="mr-2 inline-block">⚛️</span>}
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 uppercase px-1">
                  {formatTime()}
                </span>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-tr-2xl rounded-br-2xl rounded-tl-sm px-4 py-3 flex space-x-1 items-center">
              <span className="text-xs mr-2">⚛️</span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="relative flex items-end gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2 focus-within:border-sky-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a physics question..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-2 px-1 max-h-32 overflow-y-auto text-slate-200 placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-all shrink-0 ${
              !input.trim() || isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-sky-500 text-white hover:bg-sky-400'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-wider">
          PhysicsLab AI can make mistakes. Verify important formulas.
        </p>
      </div>
    </div>
  );
};
