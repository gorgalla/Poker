import React from 'react';
import { Trophy } from 'lucide-react';
import { TournamentData } from '../types';

interface PrizesPanelProps {
    data: TournamentData;
}

export const PrizesPanel: React.FC<PrizesPanelProps> = ({ data }) => {
    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-none z-20">
            <PrizeItem
                label="1er Premio"
                euros={data.premios.primeroEuros}
                color="text-yellow-400"
                glow="shadow-yellow-400/20"
                iconColor="text-yellow-400"
            />
            <PrizeItem
                label="2º Premio"
                euros={data.premios.segundoEuros}
                color="text-gray-300"
                glow="shadow-gray-400/20"
                iconColor="text-gray-300"
            />
            <PrizeItem
                label="3er Premio"
                euros={data.premios.terceroEuros}
                color="text-orange-400"
                glow="shadow-orange-400/20"
                iconColor="text-orange-400"
            />
        </div>
    );
};

const PrizeItem = ({
    label,
    euros,
    color,
    glow,
    iconColor
}: {
    label: string,
    euros: number,
    color: string,
    glow: string,
    iconColor: string
}) => {
    const safeEuros = typeof euros === 'number' && !isNaN(euros) ? euros : 0;

    return (
        <div className={`glass-panel px-8 py-6 flex items-center gap-6 min-w-[280px] backdrop-blur-md bg-black/60 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto transform hover:scale-105 transition-transform duration-300 ${glow}`}>
            <div className={`${iconColor} drop-shadow-[0_0_10px_currentColor]`}>
                <Trophy className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
                <span className={`text-xs uppercase tracking-[0.2em] opacity-80 mb-2 ${color}`}>{label}</span>
                <div className="flex flex-col">
                    <span className="font-orbitron text-white text-4xl leading-none mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {safeEuros.toFixed(0)} €
                    </span>
                </div>
            </div>
        </div>
    );
};


