import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }
    await AuthService.logout(token);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};