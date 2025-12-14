import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { BlindLevel, PlayerStats } from '../types';

interface ConfigPanelProps {
    isOpen: boolean;
    onClose: () => void;
    stats: PlayerStats; // Kept for compatibility but unused
    structure: BlindLevel[];
    onSave: (stats: PlayerStats, structure: BlindLevel[]) => void;
    onResetDefaults: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
    isOpen,
    onClose,
    stats: initialStats,
    structure: initialStructure,
    onSave,
    onResetDefaults
}) => {
    const [localStructure, setLocalStructure] = useState<BlindLevel[]>(initialStructure);

    // Reset local state when opening or when props change
    useEffect(() => {
        if (isOpen) {
            setLocalStructure(initialStructure);
        }
    }, [isOpen, initialStructure]);

    if (!isOpen) return null;

    const handleLevelChange = (index: number, field: keyof BlindLevel, value: number) => {
        const newStructure = [...localStructure];
        newStructure[index] = { ...newStructure[index], [field]: value };
        setLocalStructure(newStructure);
    };

    const reindex = (levels: BlindLevel[]) => {
        return levels.map((l, i) => ({ ...l, id: i + 1 }));
    };

    const addLevel = () => {
        const lastLevel = localStructure[localStructure.length - 1];
        const newLevel: BlindLevel = {
            id: 0, // Will be fixed by reindex
            smallBlind: lastLevel ? lastLevel.smallBlind * 2 : 25,
            bigBlind: lastLevel ? lastLevel.bigBlind * 2 : 50,
            duration: lastLevel ? lastLevel.duration : 15,
            ante: 0
        };
        setLocalStructure(reindex([...localStructure, newLevel]));
    };

    const removeLevel = (index: number) => {
        const newStructure = localStructure.filter((_, i) => i !== index);
        setLocalStructure(reindex(newStructure));
    };

    const moveLevel = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === localStructure.length - 1) return;

        const newStructure = [...localStructure];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newStructure[index], newStructure[targetIndex]] = [newStructure[targetIndex], newStructure[index]];

        setLocalStructure(reindex(newStructure));
    };

    const handleSave = () => {
        // Validate
        const isValid = localStructure.every(l =>
            l.smallBlind >= 0 &&
            l.bigBlind >= 0 &&
            (l.ante === undefined || l.ante >= 0) &&
            l.duration > 0
        );

        if (!isValid) {
            alert('Por favor, revisa los valores. Las ciegas deben ser no negativas y la duración positiva.');
            return;
        }

        onSave(initialStats, localStructure);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-bg-dark border border-neon-blue/30 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,243,255,0.1)]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-orbitron text-white tracking-wider">
                        Configurar <span className="text-neon-blue">Estructura</span>
                    </h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider text-xs">
                                        <th className="py-3 px-2">Nivel</th>
                                        <th className="py-3 px-2">Ciega P.</th>
                                        <th className="py-3 px-2">Ciega G.</th>
                                        <th className="py-3 px-2">Ante</th>
                                        <th className="py-3 px-2">Duración (min)</th>
                                        <th className="py-3 px-2 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localStructure.map((level, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-2 px-2 font-mono text-white/70">{level.id}</td>
                                            <td className="py-2 px-2">
                                                <input
                                                    type="number"
                                                    value={level.smallBlind}
                                                    onChange={(e) => handleLevelChange(index, 'smallBlind', parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-transparent border-b border-transparent focus:border-neon-blue focus:outline-none text-white"
                                                />
                                            </td>
                                            <td className="py-2 px-2">
                                                <input
                                                    type="number"
                                                    value={level.bigBlind}
                                                    onChange={(e) => handleLevelChange(index, 'bigBlind', parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-transparent border-b border-transparent focus:border-neon-blue focus:outline-none text-white"
                                                />
                                            </td>
                                            <td className="py-2 px-2">
                                                <input
                                                    type="number"
                                                    value={level.ante || 0}
                                                    onChange={(e) => handleLevelChange(index, 'ante', parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-transparent border-b border-transparent focus:border-neon-blue focus:outline-none text-white/70"
                                                />
                                            </td>
                                            <td className="py-2 px-2">
                                                <input
                                                    type="number"
                                                    value={level.duration}
                                                    onChange={(e) => handleLevelChange(index, 'duration', parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-transparent border-b border-transparent focus:border-neon-blue focus:outline-none text-white"
                                                />
                                            </td>
                                            <td className="py-2 px-2 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => moveLevel(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-1 hover:text-neon-blue disabled:opacity-30"
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveLevel(index, 'down')}
                                                        disabled={index === localStructure.length - 1}
                                                        className="p-1 hover:text-neon-blue disabled:opacity-30"
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeLevel(index)}
                                                        className="p-1 hover:text-red-500 text-white/30"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            onClick={addLevel}
                            className="flex items-center gap-2 text-sm text-neon-blue hover:text-white transition-colors px-2 py-2"
                        >
                            <Plus size={16} />
                            Añadir Nivel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
                    <button
                        onClick={() => {
                            if (confirm('¿Estás seguro de que quieres restablecer los valores por defecto?')) {
                                onResetDefaults();
                                onClose();
                            }
                        }}
                        className="flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors"
                    >
                        <RotateCcw size={16} />
                        Restablecer por defecto
                    </button>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 rounded bg-neon-blue/20 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-black font-bold transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                        >
                            <Save size={16} />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
