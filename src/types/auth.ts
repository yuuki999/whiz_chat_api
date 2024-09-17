import { Prisma, User } from '@prisma/client'

// センシティブな情報を除外したユーザー情報、これなんの意図がある？ TODO
export type SafeUser = Omit<User, 'passwordHash' | 'isAdmin'>

export interface AuthResponse {
  token: string;
  user: SafeUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
