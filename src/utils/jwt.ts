import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

const JWT_SECRET: string = process.env.JWT_SECRET!

export const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  )
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}