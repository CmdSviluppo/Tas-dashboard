export interface AuthRequest {
  username: string,
  password: string,
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

