// src/services/flight.ts
import { z } from "zod";
import { AppError } from "../utils/errors";
import { prisma } from "../utils/db";

const searchSchema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departureDate: z.string().datetime(),
  passengers: z.coerce.number().int().min(1).default(1),
});

const bookingSchema = z.object({
  flightId: z.number(),
  seatNumber: z.string(),
  passengerName: z.string().min(1),
});

export default class FlightService {
  async searchFlights(params: any) {
    try {
      const validated = searchSchema.parse(params);
      const searchDate = new Date(validated.departureDate);
      const dayOfWeek = searchDate.getDay();

      return await prisma.flight.findMany({
        where: {
          origin: validated.origin,
          destination: validated.destination,
          seatsAvailable: { gte: validated.passengers }, // Filter by number of passengers
          departureTime: {
            gte: new Date(searchDate.setHours(0, 0, 0, 0)),
            lte: new Date(searchDate.setHours(23, 59, 59, 999)),
          },
          operationalDays: {
            some: {
              day: dayOfWeek,
            },
          },
        },
        orderBy: { departureTime: "asc" },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          error.errors[0].message || "Invalid search parameters",
          400
        );
      }
      throw error;
    }
  }

  async bookFlight(userId: number, data: any) {
    try {
      const validated = bookingSchema.parse(data);

      const flight = await prisma.flight.findUnique({
        where: { flightNumber: validated.flightId },
      });

      if (!flight || flight.seatsAvailable === 0) {
        throw new AppError("Flight not available", 400);
      }

      const existingBooking = await prisma.booking.findFirst({
        where: {
          flightId: flight.id,
          seatNumber: validated.seatNumber,
        },
      });

      if (existingBooking) {
        throw new AppError("Seat already booked for this flight", 400);
      }

      const [updatedFlight, booking] = await prisma.$transaction([
        prisma.flight.update({
          where: { id: flight.id },
          data: { seatsAvailable: { decrement: 1 } },
        }),
        prisma.booking.create({
          data: {
            userId,
            flightId: flight.id,
            seatNumber: validated.seatNumber,
            passengerName: validated.passengerName,
          },
        }),
      ]);

      return {
        id: booking.id,
        flightId: booking.flightId,
        seatNumber: booking.seatNumber,
        passengerName: booking.passengerName,
        userId: booking.userId,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          error.errors[0].message || "Invalid booking data",
          400
        );
      }
      throw error;
    }
  }
}
