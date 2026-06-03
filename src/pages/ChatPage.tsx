import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/chats/ChatMessage";
import LogoBlack from "@/components/ui/LogoBlack";
import { MessageSquare, Loader2, Plus, Trash2, RotateCcwKey, LogOut } from "lucide-react";
import { chatApi } from "@/lib/chatApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiMessage, ChatRoom, SendMessageResponse } from "@/types";
import {  useNavigate } from "react-router-dom";
import PopupModel from "@/components/ui/PopupModel";

interface Messag {
  id: string;
  isUser: boolean;
  content: string;
  time: string;
}
interface UIMessage {
  id: string;
  isUser: boolean;
  content: string;
  time: string;
}
interface userDetails {
  id: string;
  email: string;
  role: string;
}

const toDisplayTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const apiMsgToUI = (m: ApiMessage): UIMessage => ({
  id: m.id,
  isUser: m.role === "user",
  content: m.content,
  time: toDisplayTime(m.created_at),
});

const renderContent = (content: string) => content;

export default function ChatPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [activeTitle, setActiveTitle] = useState<string>("New consultation");
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const bottomRef = useRef<HTMLDivElement>(null);


  const usersString = localStorage.getItem("mediq_user");

  const getEmail : userDetails | null = usersString ? JSON.parse(usersString) : null;


  // ── 1. Load sidebar chat list 
  const { data: chatsData, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => chatApi.getAllChats(),
    refetchOnWindowFocus: false,
  });
  const chatRooms: ChatRoom[] = chatsData?.chats ?? [];

  // ── 2. Load messages when user clicks a chat room 
  const { mutate: loadChat, isPending: loadingChat } = useMutation({
    mutationFn: (chat_id: string) => chatApi.getChatMessages(chat_id),
    onSuccess: (data) => {
      const chat = data.chat;
      setActiveChatId(chat.id);
      setActiveTitle(chat.title);
      setMessages(chat.messages.map(apiMsgToUI));
      setSidebarOpen(false); // close sidebar on mobile after selection
    },
  });

  // ── 3. Send message 
  const sendMutation = useMutation<SendMessageResponse, Error, string>({
    mutationFn: (query) =>
      chatApi.sendMessage(query, activeChatId ?? undefined),
    onSuccess: (data, query) => {
      // If this was a new chat, lock in the new chat_id
      if (!activeChatId) {
        setActiveChatId(data.chat_id);
        // Update title from first query (truncated)
        setActiveTitle(query.length > 60 ? query.slice(0, 60) + "..." : query);
      }

      const aiMessage: UIMessage = {
        id: Date.now().toString() + "_ai",
        isUser: false,
        content: data.answer,
        time: toDisplayTime(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Refresh sidebar so new chat appears
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          isUser: false,
          content: `Something went wrong: ${error.message}. Please try again.`,
          time: toDisplayTime(),
        },
      ]);
    },
  });

  // ── 4. Delete chat 
  const deleteMutation = useMutation({
    mutationFn: (chat_id: string) => chatApi.deleteChat(chat_id),
    onSuccess: (_, chat_id) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (activeChatId === chat_id) handleNewChat();
    },
  });

  // ── 5. New chat (reset state) 
  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setActiveTitle("New consultation");
    setInputValue("");
  }, []);

  // ── 6. Send handler 
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMutation.isPending) return;

    const userMessage: UIMessage = {
      id: Date.now().toString() + "_user",
      isUser: true,
      content: trimmed,
      time: toDisplayTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    sendMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = async () => {
  // Your logout logic here
  try {
    // await logoutApi();
    console.log("User logged out");
    localStorage.removeItem("mediq_token")
    localStorage.removeItem( "mediq_user")

    // Redirect or clear session
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  // ── 7. Auto-scroll 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  // ── Sidebar chat grouping (Today / Earlier) 
  const todayStr = new Date().toDateString();
  const todayChats = chatRooms.filter(
    (c) => new Date(c.created_at).toDateString() === todayStr,
  );
  const earlierChats = chatRooms.filter(
    (c) => new Date(c.created_at).toDateString() !== todayStr,
  );
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300`}
      >
        <div className="p-5 border-b border-gray-200">
          <LogoBlack />
          <button
            onClick={handleNewChat}
            className="mt-6 w-full bg-brand hover:bg-brand-dark text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-medium text-sm transition"
          >
            <Plus className="w-4 h-4" />
            New consultation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {chatsLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* Today */}
          {todayChats.length > 0 && (
            <div>
              <div className="uppercase text-xs font-semibold text-gray-400 px-3 mb-2">
                Today
              </div>


              <div className="space-y-1">
                {todayChats.map((chat) => (
                  <ChatRoomItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    onSelect={() => loadChat(chat.id)}
                    onDelete={() => deleteMutation.mutate(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier */}
          {earlierChats.length > 0 && (
            <div>
              <div className="uppercase text-xs font-semibold text-gray-400 px-3 mb-2">
                Earlier
              </div>
              <div className="space-y-1">
                {earlierChats.map((chat) => (
                  <ChatRoomItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    onSelect={() => loadChat(chat.id)}
                    onDelete={() => deleteMutation.mutate(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {!chatsLoading && chatRooms.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">
              No consultations yet
            </p>
          )}
        </div>

       {/* User footer */}
      <div className="border-t border-gray-200 p-4">
        <div onClick={() => navigate("/change-password")} className="cursor-pointer hover:bg-gray-100 rounded-2xl">
          <div className="flex items-center gap-5 p-3 ml-12 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100">
            <p className="font-semibold text-sm">Change Password</p>
            <RotateCcwKey className="w-6 h-6 ml-auto text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 cursor-pointer group">
          {/* Avatar */}
          <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            CP
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0"> {/* min-w-0 is important for truncation */}
            <p 
              className="font-medium text-sm text-gray-900 truncate"
              title={getEmail?.email}   // Tooltip on hover
            >
              {getEmail?.email}
            </p>
            <p className="text-xs text-gray-500">Clinical Pharmacist</p>
          </div>

          {/* Settings Icon */}
          {/* <Settings
            className="size-5 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors" 
          /> */}
          <LogOut 
            onClick={() => setShowLogoutModal(true)} 
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" 
          />
        </div>
      </div>
      </div>

      {/* ── Mobile sidebar overlay  */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-gray-300 bg-white px-4 lg:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >

             ☰
            </button>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-800 truncate max-w-xs">
                {activeTitle}
              </p>
            </div>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Knowledge Base
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Empty state */}
            {messages.length === 0 &&
              !sendMutation.isPending &&
              !loadingChat && (
                <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
                  <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-brand"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-700">
                    Ask MediQ a clinical question
                  </p>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Get evidence-based pharmaceutical answers from your uploaded
                    documents.
                  </p>
                </div>
              )}

            {/* Loading chat history */}
            {loadingChat && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-brand" />
              </div>
            )}

            {/* Messages */}
            {!loadingChat &&
              messages.map((msg) => (
                <ChatMessage key={msg.id} isUser={msg.isUser} time={msg.time}>
                  {msg.isUser ? msg.content : renderContent(msg.content)}
                </ChatMessage>
              ))}

            {/* AI thinking indicator */}
            {sendMutation.isPending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-sm">MediQ AI</span>
                    <span className="inline-flex items-center gap-1 bg-brand-light text-brand-dark text-[10px] font-medium px-3 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-md p-5 inline-flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing clinical data...
                  </div>
                </div>
              </div>
            )}


            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 bg-white p-5 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 bg-gray-100 border border-gray-200 focus-within:border-brand rounded-3xl p-2 transition">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask a clinical question..."
                className="flex-1 bg-transparent px-5 py-4 outline-none text-[15px] max-h-32 resize-none"
                disabled={sendMutation.isPending || loadingChat}
              />
              <button
                onClick={handleSend}
                disabled={
                  !inputValue.trim() || sendMutation.isPending || loadingChat
                }
                className="self-end bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-xl flex items-center justify-center text-white transition"
              >
                {sendMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg
                    className="fill-white h-[25px] w-[25px]"
                    viewBox="0 0 24 20"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-500 mt-3">
              Answers based on verified clinical sources • Not a substitute for
              professional judgement
            </p>
          </div>
        </div>
      </div>
      <PopupModel
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        content="Are you sure you want to log out?"
        buttonContent="Logout"
        buttonVariant="danger"
        onConfirm={handleLogout}
      />
    </div>
  );
}

function ChatRoomItem({
  chat,
  isActive,
  onSelect,
  onDelete,
}: {
  chat: ChatRoom;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl cursor-pointer transition group ${
        isActive ? "bg-brand-light" : "hover:bg-gray-100"
      }`}
    >
      <MessageSquare className="size-4 text-gray-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug">
          {chat.title}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(chat.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {/* Delete button — visible on hover */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // don't trigger onSelect
            onDelete();
          }}
          className="shrink-0 p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
