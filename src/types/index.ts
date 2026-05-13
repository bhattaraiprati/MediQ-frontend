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

export interface DecodedToken {
  sub?: string;
  email?: string;
  name: string;
  role: string;
  id: string;
  exp: number; // Expiration time in seconds
  iat: number; // Issued at time
}