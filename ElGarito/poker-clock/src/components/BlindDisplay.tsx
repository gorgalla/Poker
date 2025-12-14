import React from 'react';
import { BlindLevel } from '../types';

interface BlindDisplayProps {
  level?: BlindLevel;        // lo hacemos opcional por seguridad
  nextLevel?: BlindLevel;
}

// Formateador seguro: si no hay número, mostramos "-"
const formatChips = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return value.toLocaleString('es-ES');
};

export const BlindDisplay: React.FC<BlindDisplayProps> = ({ level, nextLevel }) => {
  // Si aún no hay nivel actual, no petamos la app
  if (!level) {
    return (
      <div className="flex flex-col w-full max-w-4xl mx-auto gap-8">
        <div className="glass-panel p-8 flex flex-col items-center justify-center">
          <span className="text-cyan-400/80 font-inter tracking-widest uppercase">
            No hay nivel de ciegas cargado
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-8">
      {/* Current Level Main Display */}
      <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

        <h2 className="text-cyan-400/80 font-inter text-lg tracking-widest uppercase mb-2">
          Nivel  {level.id}
        </h2>

        <div className="flex items-baseline gap-4 font-orbitron text-white">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-bold text-neon-blue">
              {formatChips(level.smallBlind)}
            </span>
            <span className="text-sm text-cyan-500/60 uppercase tracking-wider mt-1">
              Small Blind
            </span>
          </div>

          <span className="text-4xl text-cyan-700">/</span>

          <div className="flex flex-col items-center">
            <span className="text-6xl font-bold text-neon-blue">
              {formatChips(level.bigBlind)}
            </span>
            <span className="text-sm text-cyan-500/60 uppercase tracking-wider mt-1">
              Big Blind
            </span>
          </div>

          {level.ante !== undefined && (
            <>
              <span className="text-4xl text-cyan-700">+</span>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold text-neon-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">
                  {formatChips(level.ante)}
                </span>
                <span className="text-sm text-purple-400/60 uppercase tracking-wider mt-1">
                  Ante
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next Level Preview */}
      {nextLevel && (
        <div className="flex justify-center">
          <div className="glass-panel px-8 py-4 flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-cyan-400/60 font-inter text-sm uppercase tracking-wider">
              Nivel {nextLevel.id}
            </span>

            <div className="h-4 w-[1px] bg-cyan-800" />

            <div className="font-orbitron text-xl text-white">
              {formatChips(nextLevel.smallBlind)} / {formatChips(nextLevel.bigBlind)}
              {nextLevel.ante !== undefined && (
                <span className="text-purple-400 ml-2">
                  ({formatChips(nextLevel.ante)})
                </span>
              )}
            </div>

            <div className="h-4 w-[1px] bg-cyan-800" />

            <span className="text-cyan-400/60 font-inter text-sm">
              {nextLevel.duration}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};