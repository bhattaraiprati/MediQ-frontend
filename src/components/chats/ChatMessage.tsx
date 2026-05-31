import Markdown from 'react-markdown';
import { ReactNode } from 'react';

interface ChatMessageProps {
  isUser: boolean;
  children: ReactNode | string;
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
        <div className="bg-white border border-gray-300 rounded-3xl rounded-bl-md p-5 text-[15px] leading-relaxed text-gray-800">
          {typeof children === 'string' ? (
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-gray-800 mt-3 mb-1">
                    {children}
                  </h2>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-1">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-[15px]">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-1">{children}</p>
                ),
                em: ({ children }) => (
                  <em className="text-amber-700 not-italic text-sm">{children}</em>
                ),
              }}
            >
              {children}
            </Markdown>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}