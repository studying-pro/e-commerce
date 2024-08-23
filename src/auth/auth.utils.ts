import { sign, verify } from 'jsonwebtoken'

interface IJwtPayload {
  user: {
    id: string
    email: string
  }
}

interface IJwtResponse {
  accessToken: string
  refreshToken: string
}

const createPairToken = (payload: IJwtPayload, key: string, expiresIn: string): IJwtResponse => {
  const accessToken = sign(payload, key, {
    // algorithm: 'RS256',
    expiresIn
  })

  const refreshToken = sign(payload, key, {
    // algorithm: 'RS256',
    expiresIn: '7d'
  })

  return { accessToken, refreshToken }
}

const verifyToken = (token: string, key: string): IJwtPayload => {
  return verify(token, key) as IJwtPayload
}

export { createPairToken, verifyToken }
