# Baerna

Baerna is a premium developer control center and system telemetry dashboard. It features:
- **Rust Backend**: An Axum-powered HTTP API serving system metrics, workspace projects details, and tool installations.
- **React Frontend**: A TypeScript-based user interface styled with glassmorphism, overlaying the live widgets on top of an interactive Three.js floating line shader background.

## Project Structure

- `backend/`: Rust application running the API server.
- `frontend/`: React + Vite + TypeScript application running the user interface.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Rust](https://www.rust-lang.org/tools/install) (cargo 1.70+)
- [Node.js](https://nodejs.org/) (Node 18+)

### Running the Backend

Navigate to the `backend` directory and run:
```bash
cd backend
cargo run
```
The server will start listening on `http://localhost:3000`.

### Running the Frontend

Navigate to the `frontend` directory, install dependencies, and run in dev mode:
```bash
cd frontend
npm install
npm run dev
```
The application will open on `http://localhost:5173`.
