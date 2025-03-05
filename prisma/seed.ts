// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import flightData from '../src/data/flights.json';

const prisma = new PrismaClient();

async function main() {
  await prisma.flightOperationalDay.deleteMany(); // Clear existing operational days
  await prisma.flight.deleteMany(); // Clear existing flights

  for (const flight of flightData) {
    const createdFlight = await prisma.flight.create({
      data: {
        airline: flight.airline,
        airlineCode: flight.airlineCode,
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        price: flight.price,
        departureTime: new Date(flight.departure),
        arrivalTime: new Date(flight.arrival),
        duration: flight.duration,
        seatsAvailable: flight.availableSeats,
      },
    });

    // Create operational day records
    await prisma.flightOperationalDay.createMany({
      data: flight.operationalDays.map((day) => ({
        flightId: createdFlight.id,
        day,
      })),
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });