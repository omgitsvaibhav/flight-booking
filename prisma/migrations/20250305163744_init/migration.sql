/*
  Warnings:

  - A unique constraint covering the columns `[flightId,seatNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[flightId,day]` on the table `FlightOperationalDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Booking_seatNumber_key` ON `booking`;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_flightId_seatNumber_key` ON `Booking`(`flightId`, `seatNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `FlightOperationalDay_flightId_day_key` ON `FlightOperationalDay`(`flightId`, `day`);
