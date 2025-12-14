import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { TournamentState, BlindLevel } from './types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

app.use(cors());
app.use(bodyParser.json());

const defaultBlinds: BlindLevel[] = [
    { id: 1, smallBlind: 25, bigBlind: 50, duration: 15 },
    { id: 2, smallBlind: 50, bigBlind: 100, duration: 15 },
    { id: 3, smallBlind: 75, bigBlind: 150, duration: 15 },
    { id: 4, smallBlind: 100, bigBlind: 200, duration: 15 },
    { id: 5, smallBlind: 100, bigBlind: 200, ante: 25, duration: 15 },
    { id: 6, smallBlind: 150, bigBlind: 300, ante: 25, duration: 15 },
    { id: 7, smallBlind: 200, bigBlind: 400, ante: 50, duration: 15 },
    { id: 8, smallBlind: 250, bigBlind: 500, ante: 50, duration: 15 },
    { id: 9, smallBlind: 300, bigBlind: 600, ante: 75, duration: 15 },
    { id: 10, smallBlind: 400, bigBlind: 800, ante: 100, duration: 15 },
    { id: 11, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 15 },
    { id: 12, smallBlind: 600, bigBlind: 1200, ante: 200, duration: 15 },
    { id: 13, smallBlind: 800, bigBlind: 1600, ante: 200, duration: 15 },
    { id: 14, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 15 },
];

// Helper to calculate prizes
const calculatePrizes = (state: TournamentState): TournamentState => {
    const { fichasJugadores, bonusDealer, valorFicha, premios } = state;
    const { porcentajePrimero, porcentajeSegundo, porcentajeTercero } = premios;

    // Update total chips
    const fichasTotales = fichasJugadores + bonusDealer;

    // Calculate average stack
    const stackMedio = state.jugadores > 0 ? Math.floor(fichasTotales / state.jugadores) : 0;

    // Calculate prizes based ONLY on fichasJugadores
    const totalEuros = fichasJugadores / valorFicha;

    const primeroEuros = totalEuros * (porcentajePrimero / 100);
    const segundoEuros = totalEuros * (porcentajeSegundo / 100);
    const terceroEuros = totalEuros * (porcentajeTercero / 100);

    const primeroFichas = primeroEuros * valorFicha;
    const segundoFichas = segundoEuros * valorFicha;
    const terceroFichas = terceroEuros * valorFicha;

    return {
        ...state,
        fichasTotales,
        stackMedio,
        premios: {
            ...premios,
            primeroEuros,
            segundoEuros,
            terceroEuros,
            primeroFichas,
            segundoFichas,
            terceroFichas
        }
    };
};

// Initial State
let tournamentState: TournamentState = {
    jugadores: 9,
    fichasTotales: 30000,
    fichasJugadores: 30000,
    bonusDealer: 0,
    stackMedio: 0,
    valorFicha: 1000,
    blinds: defaultBlinds,
    timer: {
        isRunning: false,
        timeLeft: defaultBlinds[0].duration * 60,
        currentLevelIndex: 0,
        lastTimestamp: Date.now()
    },
    premios: {
        porcentajePrimero: 50,
        porcentajeSegundo: 30,
        porcentajeTercero: 20,
        primeroEuros: 0,
        segundoEuros: 0,
        terceroEuros: 0,
        primeroFichas: 0,
        segundoFichas: 0,
        terceroFichas: 0
    }
};

// Calculate initial prizes
tournamentState = calculatePrizes(tournamentState);

// Timer Interval on Server
setInterval(() => {
    if (tournamentState.timer.isRunning) {
        if (tournamentState.timer.timeLeft > 0) {
            tournamentState.timer.timeLeft -= 1;
        } else {
            // Level finished, move to next if available
            if (tournamentState.timer.currentLevelIndex < tournamentState.blinds.length - 1) {
                tournamentState.timer.currentLevelIndex += 1;
                const nextLevel = tournamentState.blinds[tournamentState.timer.currentLevelIndex];
                tournamentState.timer.timeLeft = nextLevel.duration * 60;
                // create audio alert event? Client handles it based on time.
                // We just update state.
            } else {
                tournamentState.timer.isRunning = false;
            }
            // Emit state update to sync level change immediately (timerUpdate only sends timer)
            io.emit('tournamentStateUpdate', tournamentState);
        }
        // Emit timer update with just timer data for lighter bandwidth if needed, 
        // but client expects syncing. 
        // We can emit 'timerUpdate' with just the timer object.
        io.emit('timerUpdate', tournamentState.timer);
    }
}, 1000);

// Routes
app.get('/api/tournament', (_req, res) => {
    res.json(tournamentState);
});

app.put('/api/tournament', (req, res) => {
    const newState = req.body;

    let updatedState = { ...tournamentState, ...newState };

    if (newState.premios) {
        updatedState.premios = { ...tournamentState.premios, ...newState.premios };
    }
    // We don't want to blindly update timer from PUT unless admin intends to override everything.
    // Ideally timer controls should be separate, but let's allow it for now if admin sends it.
    if (newState.timer) {
        updatedState.timer = { ...tournamentState.timer, ...newState.timer };
    }

    // Recalculate prizes
    updatedState = calculatePrizes(updatedState);

    tournamentState = updatedState;

    io.emit('tournamentStateUpdate', tournamentState);

    res.json(tournamentState);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Glaegard' && password === 'Espartaco321') {
        res.json({ success: true, token: 'admin-token-123' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('tournamentStateUpdate', tournamentState);

    // Admin Controls
    socket.on('admin:startTimer', () => {
        tournamentState.timer.isRunning = true;
        tournamentState.timer.lastTimestamp = Date.now();
        io.emit('tournamentStateUpdate', tournamentState);
    });

    socket.on('admin:pauseTimer', () => {
        tournamentState.timer.isRunning = false;
        io.emit('tournamentStateUpdate', tournamentState);
    });

    socket.on('admin:resetTimer', () => {
        const level = tournamentState.blinds[tournamentState.timer.currentLevelIndex] || tournamentState.blinds[0];
        tournamentState.timer.timeLeft = level.duration * 60;
        tournamentState.timer.isRunning = false;
        io.emit('tournamentStateUpdate', tournamentState);
    });

    socket.on('admin:nextLevel', () => {
        if (tournamentState.timer.currentLevelIndex < tournamentState.blinds.length - 1) {
            tournamentState.timer.currentLevelIndex += 1;
            const level = tournamentState.blinds[tournamentState.timer.currentLevelIndex];
            tournamentState.timer.timeLeft = level.duration * 60;
            tournamentState.timer.isRunning = false;
            io.emit('tournamentStateUpdate', tournamentState);
        }
    });

    socket.on('admin:prevLevel', () => {
        if (tournamentState.timer.currentLevelIndex > 0) {
            tournamentState.timer.currentLevelIndex -= 1;
            const level = tournamentState.blinds[tournamentState.timer.currentLevelIndex];
            tournamentState.timer.timeLeft = level.duration * 60;
            tournamentState.timer.isRunning = false;
            io.emit('tournamentStateUpdate', tournamentState);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
