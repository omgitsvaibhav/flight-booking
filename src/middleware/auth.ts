import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db';

interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const session = await prisma.session.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });

    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};