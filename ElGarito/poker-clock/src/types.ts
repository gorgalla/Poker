export interface BlindLevel {
    id: number;
    smallBlind: number;
    bigBlind: number;
    ante?: number;
    duration: number; // in minutes
    isBreak?: boolean;
    label?: string;
}

export interface PlayerStats {
    remaining: number;
    totalChips: number;
    averageStack: number;
}


export type TournamentState = {
    jugadores: number;
    fichasTotales: number; // Sum of fichasJugadores + bonusDealer
    fichasJugadores: number; // Chips that count for prizes
    bonusDealer: number; // Chips that do NOT count for prizes
    stackMedio: number; // fichasTotales / jugadores
    valorFicha: number;
    blinds: BlindLevel[];
    timer: {
        isRunning: boolean;
        timeLeft: number; // seconds remaining in current level
        currentLevelIndex: number;
        lastTimestamp: number; // Date.now() when the timer was last updated/started
    };
    premios: {
        porcentajePrimero: number;
        porcentajeSegundo: number;
        porcentajeTercero: number;
        primeroEuros: number;
        segundoEuros: number;
        terceroEuros: number;
        primeroFichas: number;
        segundoFichas: number;
        terceroFichas: number;
    };
};

// Deprecated or alias if needed, but better to use TournamentState
export type TournamentData = TournamentState;

