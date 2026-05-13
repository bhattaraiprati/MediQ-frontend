import { useState } from 'react';

import ChatMessage from '@/components/chats/ChatMessage';
import Logo from '@/components/ui/Logo';
import LogoBlack from '@/components/ui/LogoBlack';
import { MessageSquare, Settings } from 'lucide-react';


export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const suggestedQuestions = [
    "Amoxicillin rash: when to worry?",
    "Amoxicillin-clavulanate vs amoxicillin alone",
    "Probiotics for amoxicillin-induced diarrhea",
    "Amoxicillin & oral contraceptives interaction",
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300`}>
        <div className="p-5 border-b border-gray-200">
          <LogoBlack />
          
          <button className="mt-6 w-full bg-brand hover:bg-brand-dark text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-medium text-sm transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New consultation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <div className="uppercase text-xs font-semibold text-gray-400 px-3 mb-2">Today</div>
            <div className="space-y-1">
              {["Amoxicillin 500mg side effects", "Amoxicillin vs Augmentin", "Penicillin allergy cross-reactivity"].map((title, i) => (
                <div key={i} className={`flex gap-3 px-4 py-3 rounded-2xl cursor-pointer transition ${i === 0 ? 'bg-brand-light' : 'hover:bg-gray-100'}`}>
                  <MessageSquare  className='size-4 text-gray-500 mt-3'/>
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-2">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{i === 0 ? "Now" : i === 1 ? "10 min ago" : "1 hr ago"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="uppercase text-xs font-semibold text-gray-400 px-3 mb-2">Yesterday</div>
            {/* Add more chat history as needed */}
          </div>
        </div>

        {/* User Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 cursor-pointer">
            <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center text-white font-semibold text-sm">DR</div>
            <div className="flex-1">
              <p className="font-medium text-sm">Dr. Reena Shah</p>
              <p className="text-xs text-gray-500">Clinical Pharmacist</p>
            </div>
            <Settings className='size-5 text-gray-400 hover:text-gray-600' />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-gray-300 bg-white px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              ☰
            </button>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Amoxicillin 500mg — Side effects & safety</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Knowledge Base
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Time Separator */}
            <div className="text-center text-xs text-gray-400">Today • 09:42 AM</div>

            {/* Messages */}
            <ChatMessage isUser>
              What is the typical use of amoxicillin 500mg, and what are its most common side effects?
            </ChatMessage>

            <ChatMessage isUser={false}>
              <p><strong>Amoxicillin 500mg</strong> is a broad-spectrum penicillin antibiotic used for...</p>
              <p><strong>Common side effects:</strong> diarrhea (most frequent), nausea, rash, and oral thrush.</p>
              <p><strong>Important:</strong> Monitor for allergic reactions and C. difficile risk.</p>
            </ChatMessage>

            <ChatMessage isUser>
              Is amoxicillin safe in patients with penicillin allergy? And does it need dose adjustment in renal impairment?
            </ChatMessage>

            <ChatMessage isUser={false}>
              <p><strong>Contraindicated</strong> in IgE-mediated penicillin allergy.</p>
              <p><strong>Renal adjustment:</strong> Extend interval if CrCl &lt; 30 mL/min.</p>
            </ChatMessage>

            {/* Suggested Follow-ups */}
            <div>
              <p className="uppercase text-xs font-semibold text-gray-500 mb-3">Suggested follow-ups</p>
              <div className="flex flex-wrap gap-3">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(q)}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-brand rounded-3xl text-sm text-gray-700 hover:text-brand transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 bg-gray-100 border border-gray-200 focus-within:border-brand rounded-3xl p-2 transition">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={1}
                placeholder="Ask a clinical question about amoxicillin..."
                className="flex-1 bg-transparent px-5 py-4 outline-none text-[15px] max-h-32"
              />
              <button className="self-end bg-brand hover:bg-brand-dark w-10 h-10 rounded-xl flex items-center justify-center text-white transition">
                <svg className='fill-white h-[25px] w-[25px]' viewBox="0 0 24 20"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </button>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-3">
              Answers based on verified clinical sources • Not a substitute for professional judgement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}