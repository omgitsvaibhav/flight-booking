import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler: ErrorRequestHandler<
  ParamsDictionary, 
  any, 
  any, 
  QueryString.ParsedQs, 
  Record<string, any>
> = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};