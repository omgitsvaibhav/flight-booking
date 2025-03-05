// src/services/authService.ts
import { prisma } from '../utils/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export default class AuthService {
  static async signup(data: { email: string; password: string; name: string }) {
    try {
      const { email, password, name } = signupSchema.parse(data);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return { token, userId: user.id };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          error.errors[0].message || 'Invalid signup data',
          400
        );
      }
      throw error;
    }
  }

  static async login(credentials: { email: string; password: string }) {
    try {
      const { email, password } = loginSchema.parse(credentials);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check for an existing valid session
      const existingSession = await prisma.session.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingSession) {
        return { token: existingSession.token, userId: user.id };
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return { token, userId: user.id };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          error.errors[0].message || 'Invalid login credentials',
          400
        );
      }
      throw error;
    }
  }

  static async logout(token: string) {
    try {
      await prisma.session.deleteMany({
        where: { token },
      });
    } catch (error) {
      throw new AppError('Failed to logout', 500);
    }
  }
}