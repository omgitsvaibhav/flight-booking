-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `airline` VARCHAR(191) NOT NULL,
    `airlineCode` VARCHAR(191) NOT NULL,
    `flightNumber` INTEGER NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `departure` DATETIME(3) NOT NULL,
    `arrival` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `availableSeats` INTEGER NOT NULL,

    UNIQUE INDEX `Flight_flightNumber_key`(`flightNumber`),
    INDEX `Flight_origin_destination_idx`(`origin`, `destination`),
    INDEX `Flight_departure_idx`(`departure`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `flightId` INTEGER NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `passengerName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightOperationalDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flightId` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightOperationalDay` ADD CONSTRAINT `FlightOperationalDay_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
