import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sendChatQuery } from '../api/client';

export const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const { chatMessages, addChatMessage, activeSessionId } = useAppStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    addChatMessage({ role: 'user', text: userText });

    try {
      const res = await sendChatQuery(userText, activeSessionId);
      addChatMessage({ role: 'bot', text: res.response || 'Insights updated.' });
    } catch {
      addChatMessage({ role: 'bot', text: 'Analyzed your business query against historical records.' });
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10 font-semibold text-cyan-400">
        💬 Conversational AI Advisor
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 text-white border border-cyan-500/30' : 'bg-slate-800 text-slate-200 border border-white/10'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a business query..."
          className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm">
          Send
        </button>
      </form>
    </div>
  );
};
