import { ReactNode } from 'react';

interface ChatMessageProps {
  isUser: boolean;
  children: ReactNode;
  time?: string;
}

export default function ChatMessage({ isUser, children, time }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-brand text-white px-5 py-3.5 rounded-3xl rounded-br-md max-w-[68%] text-[15px] leading-relaxed">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-sm">MediQ AI</span>
          <span className="inline-flex items-center gap-1 bg-brand-light text-brand-dark text-[10px] font-medium px-3 py-1 rounded-full">
            ✓ Verified
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-md p-5 text-[15px] leading-relaxed text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}