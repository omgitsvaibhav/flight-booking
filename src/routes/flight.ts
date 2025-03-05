// src/routes/flightRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { searchFlights, bookFlight } from '../controllers/flight';

const flightRoutes = Router();

flightRoutes.get('/search', searchFlights);
flightRoutes.post('/book', authMiddleware, bookFlight);

export default flightRoutes