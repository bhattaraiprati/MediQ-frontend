import { changePassword, DecodedToken, LoginCredentials, RegisterCredentials, User } from "@/types"
import { jwtDecode } from "jwt-decode"

export const BASE_URL = 'http://localhost:5000/api'
export const TOKEN_KEY = 'mediq_token'
export const USER_KEY = 'mediq_user'

// Decode JWT payload
function decodeToken(token: string): User | null {
  try {
    // const payload = token.split('.')[1]
    // const decoded = JSON.parse(atob(payload))
    const decoded = jwtDecode<DecodedToken>(token);

    return {
      id: decoded.id ?? decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    } as User
  } catch {
    return null
  }
}

const request = async <T>(
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
      // window.location.href = '/'
    }

    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const authApi = {

  async login(credentials: LoginCredentials) {

    const data = await request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const user = decodeToken(data.token)

    if (user) {
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    return {
      token: data.token,
      user,
    }
  },

  async register(credentials: RegisterCredentials) {

    const data = await request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const user = decodeToken(data.token)

    if (user) {
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    return {
      token: data.token,
      user,
    }
  },

  async changePassword (credentials: changePassword){
    const data = await request<{message: string}>('/auth/change-password',{
      method: "POST",
      body: JSON.stringify(credentials),
    })

    return data.message;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem(USER_KEY)

    if (!user) return null

    return JSON.parse(user)
  },
}