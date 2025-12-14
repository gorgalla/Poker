import React from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

interface ControlsProps {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isRunning, onToggle, onReset, onNext, onPrev }) => {
    return (
        <div className="flex items-center justify-center gap-6 mt-8">
            <button
                onClick={onPrev}
                className="p-4 rounded-full glass-panel hover:bg-cyan-900/30 text-cyan-400 transition-all hover:scale-110 active:scale-95 group"
                title="Previous Level"
            >
                <ChevronLeft className="w-6 h-6 group-hover:drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
            </button>

            <button
                onClick={onToggle}
                className={`
          w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95
          ${isRunning
                        ? 'bg-transparent border-2 border-neon-red text-neon-red shadow-[0_0_20px_rgba(255,7,58,0.3)] hover:shadow-[0_0_30px_rgba(255,7,58,0.5)]'
                        : 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:shadow-[0_0_40px_rgba(0,243,255,0.7)] hover:bg-white'
                    }
        `}
            >
                {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            <button
                onClick={onReset}
                className="p-4 rounded-full glass-panel hover:bg-red-900/30 text-red-400 transition-all hover:scale-110 active:scale-95 group"
                title="Reset Level"
            >
                <RotateCcw className="w-6 h-6 group-hover:drop-shadow-[0_0_5px_rgba(255,7,58,0.8)]" />
            </button>

            <button
                onClick={onNext}
                className="p-4 rounded-full glass-panel hover:bg-cyan-900/30 text-cyan-400 transition-all hover:scale-110 active:scale-95 group"
                title="Next Level"
            >
                <ChevronRight className="w-6 h-6 group-hover:drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
            </button>
        </div>
    );
};
