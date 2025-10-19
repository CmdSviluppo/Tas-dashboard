export interface AuthRequest {
  username: string | null,
  password: string | null,
}

export interface RefreshTokenRequest {
  refreshToken: string,
  roles: string[]
}

export interface RegisterRequest {
  password: string,
  email: string,
  role: string
}

