# Honey Games Demo Backend

A lightweight Node.js server for simulating live product data with WebSocket support.

## Features

- **Real-time updates** via Socket.IO
- **REST Endpoints** for triggering simulations
- **In-memory data store** (resets on restart)
- **CORS enabled** for easy connection from Vercel

## Setup

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Start the server**:
    ```bash
    npm run dev
    ```
    Runs on `http://localhost:4000`.

## Ngrok Setup (Public Access)

To allow the deployed Vercel app to talk to your local backend:

1.  **Start the server** locally:

    ```bash
    npm run dev
    ```

2.  **Expose via ngrok** (in a new terminal):

    ```bash
    ngrok http 4000
    ```

3.  **Copy the Forwarding URL** (e.g., `https://abcd-123.ngrok-free.app`).

4.  **Update Frontend Config**:
    Use this URL in your frontend application to connect to the WebSocket and API.

## API Endpoints

- `GET /state`: View current full state.
- `POST /reset`: Clear all data.

### Simulation

- `POST /simulate/booking` (Body: JSON object of booking)
- `POST /simulate/visit` (Body: JSON object of visit)
- `POST /simulate/badge` (Body: JSON object of badge)

## WebSocket Events

- `state:update`: Sent on connection and any change.
- `booking:update`: Sent when a booking is simulated.
- `visit:update`: Sent when a visit is simulated.
- `badge:update`: Sent when a badge is simulated.
