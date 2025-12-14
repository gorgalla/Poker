import React from 'react';
import { cn } from '../utils/cn'; // I need to create this utility or just use clsx directly

interface ClockProps {
    seconds: number;
    isRunning: boolean;
    isDanger?: boolean;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const Clock: React.FC<ClockProps> = ({ seconds, isRunning, isDanger }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 relative">
            {/* Outer Glow Ring */}
            <div className={cn(
                "absolute inset-0 rounded-full opacity-20 blur-3xl transition-colors duration-1000",
                isDanger ? "bg-neon-red" : "bg-neon-blue"
            )} />

            {/* Time Display */}
            <div className={cn(
                "relative z-10 font-orbitron text-[12rem] leading-none tracking-wider transition-colors duration-300 select-none",
                isDanger ? "text-neon-red drop-shadow-[0_0_30px_rgba(255,7,58,0.6)]" : "text-neon-blue drop-shadow-[0_0_30px_rgba(0,243,255,0.6)]"
            )}>
                {formatTime(seconds)}
            </div>

            {/* Status Indicator */}
            <div className={cn(
                "mt-4 text-xl font-inter tracking-[0.5em] uppercase opacity-80",
                isDanger ? "text-red-400" : "text-cyan-400"
            )}>
                {isRunning ? 'En Juego' : 'Pausa'}
            </div>
        </div>
    );
};