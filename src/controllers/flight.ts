import { Request, Response, NextFunction } from 'express';
import FlightService from '../services/flight';

const flightService = new FlightService();

export const searchFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flights = await flightService.searchFlights(req.query);
    res.json(flights);
  } catch (error) {
    next(error); 
  }
};

export const bookFlight = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await flightService.bookFlight(req.user!.id, req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error); 
  }
};