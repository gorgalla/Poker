import { io } from 'socket.io-client';
import { TournamentData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const socket = io(API_URL);

export const getTournamentData = async (): Promise<TournamentData> => {
    const response = await fetch(`${API_URL}/api/tournament`);
    return response.json();
};

export const updateTournamentData = async (data: Partial<TournamentData>): Promise<TournamentData> => {
    const response = await fetch(`${API_URL}/api/tournament`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const startTimer = () => socket.emit('admin:startTimer');
export const pauseTimer = () => socket.emit('admin:pauseTimer');
export const resetTimer = () => socket.emit('admin:resetTimer');
export const nextLevel = () => socket.emit('admin:nextLevel');
export const prevLevel = () => socket.emit('admin:prevLevel');
