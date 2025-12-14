import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Clock } from '../components/Clock';
import { BlindDisplay } from '../components/BlindDisplay';
import { StatsPanel } from '../components/StatsPanel';
import { PrizesPanel } from '../components/PrizesPanel';
import { TournamentState } from '../types';
import { getTournamentData, socket } from '../services/socket';

export const ClockView = () => {
    const [tournamentData, setTournamentData] = useState<TournamentState>({
        jugadores: 0,
        fichasTotales: 0,
        fichasJugadores: 0,
        bonusDealer: 0,
        stackMedio: 0,
        valorFicha: 1000,
        blinds: [],
        timer: {
            isRunning: false,
            timeLeft: 0,
            currentLevelIndex: 0,
            lastTimestamp: Date.now()
        },
        premios: {
            porcentajePrimero: 0, porcentajeSegundo: 0, porcentajeTercero: 0,
            primeroEuros: 0, segundoEuros: 0, terceroEuros: 0,
            primeroFichas: 0, segundoFichas: 0, terceroFichas: 0
        },
    });

    useEffect(() => {
        getTournamentData().then(setTournamentData);

        const handleStateUpdate = (newData: TournamentState) => {
            setTournamentData(newData);
        };

        const handleTimerUpdate = (newTimer: TournamentState['timer']) => {
            setTournamentData(prev => ({ ...prev, timer: newTimer }));
        };

        socket.on('tournamentStateUpdate', handleStateUpdate);
        socket.on('timerUpdate', handleTimerUpdate);

        return () => {
            socket.off('tournamentStateUpdate', handleStateUpdate);
            socket.off('timerUpdate', handleTimerUpdate);
        };
    }, []);

    // Derived state from Server Data
    const { timer, blinds } = tournamentData;
    const currentLevel = blinds && blinds[timer.currentLevelIndex]
        ? blinds[timer.currentLevelIndex]
        : { id: 0, smallBlind: 0, bigBlind: 0, duration: 0 };

    const upcomingLevel = blinds && blinds[timer.currentLevelIndex + 1]
        ? blinds[timer.currentLevelIndex + 1]
        : undefined;

    return (
        <div className="min-h-screen bg-bg-dark text-white relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-bg-dark to-bg-dark z-0" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center gap-12 h-screen justify-center">

                <header className="absolute top-8 left-0 w-full flex justify-between items-center px-8">
                    <div className="flex items-center gap-4">
                        <img src="/icon.png" alt="Logo" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                        <div className="flex flex-col">
                            <h1 className="font-orbitron text-2xl text-neon-blue tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                                El Garito de Teddy <span className="text-white">KGB</span>
                            </h1>
                            <div className="text-xs font-inter text-cyan-500/50 uppercase tracking-[0.2em]">
                                Reloj de Torneo 1.0
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <Clock
                        seconds={timer.timeLeft}
                        isRunning={timer.isRunning}
                        isDanger={timer.timeLeft < 60 && timer.isRunning}
                    />

                    <div className="mt-12 w-full">
                        <BlindDisplay level={currentLevel} nextLevel={upcomingLevel} />
                    </div>
                </div>

                <div className="hidden md:block">
                    <PrizesPanel data={tournamentData} />
                </div>
                {/* Mobile Prizes View */}
                <div className="md:hidden w-full px-4 grid grid-cols-1 gap-2 mt-4">
                    <div className="bg-black/30 border border-neon-blue/30 p-4 rounded-lg">
                        <h3 className="text-neon-blue font-orbitron text-sm mb-2">Premios</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-yellow-400">1º</span>
                                <span>{(tournamentData.premios.primeroEuros ?? 0).toFixed(0)}€</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">2º</span>
                                <span>{(tournamentData.premios.segundoEuros ?? 0).toFixed(0)}€</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-orange-400">3º</span>
                                <span>{(tournamentData.premios.terceroEuros ?? 0).toFixed(0)}€</span>
                            </div>
                        </div>
                    </div>
                </div>

                <StatsPanel data={tournamentData} />

                <Link to="/login" className="absolute bottom-4 right-4 text-gray-600 hover:text-neon-blue transition-colors flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 hover:opacity-100">
                    <Shield size={12} />
                    Admin
                </Link>
            </div>
        </div>
    );
};
