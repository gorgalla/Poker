import { BlindLevel } from '../types';

export const defaultStructure: BlindLevel[] = [
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
