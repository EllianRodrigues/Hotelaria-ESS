# Express SQLite MVC API

This is a Node.js API using Express, SQLite, and the MVC architecture.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t express-sqlite-mvc-api .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 express-sqlite-mvc-api
   ```

## Running with Docker Compose

1. In the `backend` directory, run:
   ```bash
   docker-compose up --build
   ```
2. The API will be available at [http://localhost:3000](http://localhost:3000)

## API Example

- `GET /api/users` — List all users 