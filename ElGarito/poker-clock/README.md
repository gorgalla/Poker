# Teddy KGB Poker Clock

A clandestine, neon-styled poker tournament clock inspired by the underground vibes of "Rounders".

## Features

- **Visuals**: Deep navy background, neon cyan/blue accents, glassmorphism UI.
- **Timer**: Accurate countdown timer that handles tab switching correctly.
- **Blinds**: Displays current Small/Big blinds and Ante, plus next level preview.
- **Real-time Admin**: Admin panel to manage players, chips, and prizes in real-time.
- **Controls**: Start, Pause, Reset, Next Level, Previous Level.
- **Responsive**: Works on desktop and tablets.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, Socket.io Client
- **Backend**: Node.js, Express, Socket.io

## Setup & Running

This project runs with a Client (Vite) and a Server (Node/Express).

### Prerequisites
- Node.js (v18+ recommended)
- NPM

### 1. Installation
Install dependencies in the root directory:
```bash
npm install
```

### 2. Running the App
You need to run **both** the server and the client. Open two terminal windows.

**Terminal 1 (Server):**
This powers the tournament state, timer, and socket connections.
```bash
npm run server
```
_Server runs on http://localhost:3001_

**Terminal 2 (Client):**
This runs the React application (Clock & Admin).
```bash
npm run dev
```
_Client runs on http://localhost:5173 (usually)_

### 3. Usage
1. Open the Client URL.
2. The main view is the **Clock View** (Read-Only).
3. Click the subtle **Admin** link (bottom right) or go to `/login`.
   - **User**: Glaegard
   - **Pass**: Espartaco321
4. Use the **Admin Panel** to:
   - Control the Timer (Start/Pause/Reset/Next/Prev).
   - Edit Blind Structure.
   - Manage Chips & Awards.




## "Pay that man his money."
