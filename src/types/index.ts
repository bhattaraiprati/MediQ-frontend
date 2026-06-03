export interface User {
  id: string
  name: string
  email: string
  role: string
  avatarInitials: string
}

export interface LoginCredentials {
  email: string
  password: string
}
export interface RegisterCredentials {
  name: string
  email: string
  password: string
}
export interface changePassword {
  oldPassword : string;
  newPassword: string;
}

export interface DecodedToken {
  sub?: string;
  email?: string;
  name: string;
  role: string;
  id: string;
  exp: number; // Expiration time in seconds
  iat: number; // Issued at time
}

export interface ChatRoom {
  id: string
  title: string
  created_at: string
}

export interface ApiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface ChatRoomWithMessages extends ChatRoom {
  messages: ApiMessage[]
}

export interface SendMessageResponse {
  success: boolean
  chat_id: string
  query: string
  answer: string
}