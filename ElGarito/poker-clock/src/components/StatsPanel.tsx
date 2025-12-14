import React from 'react';
import { Users, Coins, TrendingUp } from 'lucide-react';
import { TournamentData } from '../types';

interface StatsPanelProps {
    data: TournamentData;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ data }) => {
    // stackMedio is now calculated on the server and passed in data
    const stackMedio = data.stackMedio ?? (data.jugadores > 0 ? Math.floor(data.fichasTotales / data.jugadores) : 0);

    return (
        <div className="fixed bottom-8 left-0 w-full flex justify-center gap-8 px-4 pointer-events-none z-20">
            <StatItem icon={<Users className="w-6 h-6" />} label="Jugadores" value={data.jugadores} />
            <StatItem icon={<Coins className="w-6 h-6" />} label="Fichas en juego" value={formatChips(data.fichasTotales)} />
            <StatItem icon={<TrendingUp className="w-6 h-6" />} label="Stack Medio" value={formatChips(stackMedio)} />
        </div>
    );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="glass-panel px-8 py-4 flex items-center gap-4 min-w-[200px] backdrop-blur-md bg-black/60 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto transform hover:scale-105 transition-transform duration-300">
        <div className="text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">{icon}</div>
        <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 mb-1">{label}</span>
            <span className="font-orbitron text-white text-3xl leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{value}</span>
        </div>
    </div>
);

const formatChips = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
};
