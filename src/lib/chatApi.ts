import { ChatRoom, ChatRoomWithMessages, SendMessageResponse } from "@/types"
import { authApi, BASE_URL, TOKEN_KEY } from "./api"


export const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> =>{

  const token = localStorage.getItem(TOKEN_KEY)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    if (response.status === 401) {
        authApi.logout()
      window.location.href = '/'
    }

    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const chatApi = {
  // Send message — pass chat_id to continue, omit to create new chat
  async sendMessage(query: string, chat_id?: string): Promise<SendMessageResponse> {
    return request<SendMessageResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ query, ...(chat_id ? { chat_id } : {}) }),
    })
  },

  // Sidebar: all chat rooms for the logged-in user
  async getAllChats(): Promise<{ success: boolean; chats: ChatRoom[] }> {
    return request('/chat')
  },

  // Open a chat room: returns full message history
  async getChatMessages(chat_id: string): Promise<{ success: boolean; chat: ChatRoomWithMessages }> {
    return request(`/chat/${chat_id}`)
  },

  // Delete a chat room
  async deleteChat(chat_id: string): Promise<{ success: boolean }> {
    return request(`/chat/${chat_id}`, { method: 'DELETE' })
  },
}
