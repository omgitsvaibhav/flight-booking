# Flight Booking API

## Features

- **User Authentication**: Sign up, log in, and log out with JWT-based session management.
- **Flight Search**: Search flights by origin, destination, and departure date, filtered by operational days.
- **Flight Booking**: Book flights with unique seat numbers per flight, stored in a MySQL database.
- **Error Handling**: Robust error handling with meaningful responses.
- **Database Integration**: Uses Prisma ORM with MySQL for persistent data storage.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js
- **MySQL**: Version 8.x or higher
- **Git**: For cloning the repository

## Setup Instructions

Follow these steps to run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/omgitsvaibhav/flight-booking.git
cd flight-booking
```

## Installation and Setup

### 2. Install Dependencies
Install the required Node.js packages:

```bash
npm install
```

This installs Express, TypeScript, Prisma, JWT, bcrypt, and other dependencies listed in `package.json`.

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="mysql://username:password@localhost:3306/flight_booking"
JWT_SECRET="your-secret-key-here"
PORT=3008
```

- `DATABASE_URL`: Replace username and password with your MySQL credentials. Ensure the database `flight_booking` exists (create it in MySQL if needed).
- `JWT_SECRET`: Use a strong, unique secret key (e.g., generate one with `openssl rand -base64 32`).
- `PORT`: Default is 3008; change if needed.

### 4. Set Up the Database
Initialize the database schema with Prisma:

```bash
npm run migrate
```

This creates the Flight, Booking, User, Session, and FlightOperationalDay tables based on `prisma/schema.prisma`.

### 5. Seed the Database
Populate the database with initial flight data:

```bash
npm run seed
```

The script (`prisma/seed.ts`) loads flight data from `src/data/flights.json` into the Flight and FlightOperationalDay tables.

### 6. Run the Application
Start the server:

```bash
npm run dev
```

The app runs on `http://localhost:3008` (or your configured PORT).

You should see: *Server running on port 3008*.
