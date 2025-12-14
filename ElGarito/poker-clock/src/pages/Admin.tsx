import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TournamentState, BlindLevel } from '../types';
import { getTournamentData, updateTournamentData, socket, startTimer, pauseTimer, resetTimer, nextLevel, prevLevel } from '../services/socket';
import { Plus, Minus, Play, Pause, SkipForward, SkipBack, RotateCcw, Settings } from 'lucide-react';
import { ConfigPanel } from '../components/ConfigPanel';
// defaultStructure is unused here as we pull from server, but types are needed

export const Admin = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<TournamentState | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        getTournamentData().then((d) => {
            setData(d);
            setLoading(false);
        });

        const handleStateUpdate = (newData: TournamentState) => {
            setData(newData);
        };
        const handleTimerUpdate = (newTimer: TournamentState['timer']) => {
            setData(prev => prev ? ({ ...prev, timer: newTimer }) : null);
        };

        socket.on('tournamentStateUpdate', handleStateUpdate);
        socket.on('timerUpdate', handleTimerUpdate);

        return () => {
            socket.off('tournamentStateUpdate', handleStateUpdate);
            socket.off('timerUpdate', handleTimerUpdate);
        };
    }, [navigate]);

    const handleSave = async () => {
        if (data) {
            await updateTournamentData(data);
            alert('Guardado correctamente');
        }
    };

    const handleChange = (field: keyof TournamentState, value: number) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handlePremioChange = (field: keyof TournamentState['premios'], value: number) => {
        if (data) {
            setData({
                ...data,
                premios: { ...data.premios, [field]: value }
            });
        }
    };

    const adjustChips = (field: 'fichasJugadores' | 'bonusDealer', amount: number) => {
        if (data) {
            // Need cast because keyof TournamentState is inclusive of objects, but we know these are numbers
            const val = data[field] as number;
            handleChange(field, (val || 0) + amount);
        }
    };

    const addNormalChips30k = async () => {
        if (data) {
            await updateTournamentData({ fichasJugadores: data.fichasJugadores + 30000 });
        }
    };

    const addBonusChips10k = async () => {
        if (data) {
            await updateTournamentData({ bonusDealer: data.bonusDealer + 10000 });
        }
    };

    const handleStructureSave = async (_: any, newStructure: BlindLevel[]) => {
        if (data) {
            await updateTournamentData({ blinds: newStructure });
            // Close handled by component usually, or here
        }
    };

    // Dummy reset, admin should define what "defaults" mean or we assume server handles it
    const handleResetDefaults = () => {
        alert("Para reiniciar estructura, contacta al soporte técnico o edita manualmente.");
    };

    if (loading || !data) return <div className="text-white">Cargando...</div>;

    // Safe access for display
    const safeEuros = (val: number | undefined) => (typeof val === 'number' ? val : 0).toFixed(2);


    return (
        <div className="min-h-screen bg-bg-dark text-white p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-orbitron text-neon-blue">Panel de Administración</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsConfigOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-black/30 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue transition-all"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Estructura</span>
                        </button>
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">Volver al Reloj</button>
                    </div>
                </div>

                {/* Clock Controls */}
                <div className="bg-black/30 border border-neon-blue/30 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-orbitron text-white mb-4">Control del Reloj</h2>
                    <div className="flex gap-6 justify-center items-center">
                        <button
                            onClick={prevLevel}
                            className="p-4 rounded-full bg-black/40 border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue transition-all"
                            title="Nivel Anterior"
                        >
                            <SkipBack size={24} className="text-neon-blue" />
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-full bg-black/40 border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue transition-all"
                            title="Reiniciar Nivel"
                        >
                            <RotateCcw size={24} className="text-neon-blue" />
                        </button>

                        <button
                            onClick={data.timer.isRunning ? pauseTimer : startTimer}
                            className="p-6 rounded-full bg-neon-blue/10 border border-neon-blue hover:bg-neon-blue/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                            title={data.timer.isRunning ? "Pausar" : "Iniciar"}
                        >
                            {data.timer.isRunning ? (
                                <Pause size={32} className="text-neon-blue" />
                            ) : (
                                <Play size={32} className="text-neon-blue ml-1" />
                            )}
                        </button>

                        <button
                            onClick={nextLevel}
                            className="p-4 rounded-full bg-black/40 border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue transition-all"
                            title="Siguiente Nivel"
                        >
                            <SkipForward size={24} className="text-neon-blue" />
                        </button>
                    </div>
                    <div className="text-center mt-4 text-neon-blue font-orbitron text-2xl tracking-widest">
                        {Math.floor(data.timer.timeLeft / 60).toString().padStart(2, '0')}:
                        {(data.timer.timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Tournament State */}
                    <div className="bg-black/30 border border-neon-blue/30 p-6 rounded-xl">
                        <h2 className="text-xl font-orbitron text-white mb-4">Estado del Torneo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Jugadores</label>
                                <input
                                    type="number"
                                    value={data.jugadores}
                                    onChange={(e) => handleChange('jugadores', Number(e.target.value))}
                                    className="w-full bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Valor de la ficha (fichas por 1 €)</label>
                                <input
                                    type="number"
                                    value={data.valorFicha}
                                    onChange={(e) => handleChange('valorFicha', Number(e.target.value))}
                                    className="w-full bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white"
                                />
                            </div>

                            {/* Fichas Jugadores */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Fichas Jugadores (Premio)</label>
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => adjustChips('fichasJugadores', -5000)}
                                        className="p-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/40 transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <input
                                        type="number"
                                        value={data.fichasJugadores}
                                        onChange={(e) => handleChange('fichasJugadores', Number(e.target.value))}
                                        className="flex-1 bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white text-center font-mono text-lg"
                                    />
                                    <button
                                        onClick={() => adjustChips('fichasJugadores', 5000)}
                                        className="p-2 bg-green-500/20 border border-green-500/50 rounded hover:bg-green-500/40 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={addNormalChips30k}
                                    className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span>+30.000 Normal Chips</span>
                                </button>
                            </div>

                            {/* Bonus Dealer */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Bonus Dealer (No Premio)</label>
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => adjustChips('bonusDealer', -5000)}
                                        className="p-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/40 transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <input
                                        type="number"
                                        value={data.bonusDealer}
                                        onChange={(e) => handleChange('bonusDealer', Number(e.target.value))}
                                        className="flex-1 bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white text-center font-mono text-lg"
                                    />
                                    <button
                                        onClick={() => adjustChips('bonusDealer', 5000)}
                                        className="p-2 bg-green-500/20 border border-green-500/50 rounded hover:bg-green-500/40 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={addBonusChips10k}
                                    className="mt-3 w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-bold transition-all shadow-[0_0_10px_rgba(202,138,4,0.3)] flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span>+10.000 Dealer Bonus</span>
                                </button>
                            </div>

                            <div className="md:col-span-2 text-center text-gray-400 text-sm">
                                Total en juego: {(data.fichasJugadores + data.bonusDealer).toLocaleString()} fichas
                            </div>

                        </div>
                    </div>

                    {/* Prizes */}
                    <div className="bg-black/30 border border-neon-blue/30 p-6 rounded-xl">
                        <h2 className="text-xl font-orbitron text-white mb-4">Premios (Porcentajes)</h2>
                        <div className="space-y-6">

                            {/* 1st Prize */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-yellow-400 font-bold">Porcentaje 1er premio</label>
                                    <div className="text-sm text-gray-400">
                                        {safeEuros(data.premios.primeroEuros)} €
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    value={data.premios.porcentajePrimero}
                                    onChange={(e) => handlePremioChange('porcentajePrimero', Number(e.target.value))}
                                    className="w-full bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white"
                                />
                            </div>

                            {/* 2nd Prize */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-400 font-bold">Porcentaje 2º premio</label>
                                    <div className="text-sm text-gray-400">
                                        {safeEuros(data.premios.segundoEuros)} €
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    value={data.premios.porcentajeSegundo}
                                    onChange={(e) => handlePremioChange('porcentajeSegundo', Number(e.target.value))}
                                    className="w-full bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white"
                                />
                            </div>

                            {/* 3rd Prize */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-orange-400 font-bold">Porcentaje 3er premio</label>
                                    <div className="text-sm text-gray-400">
                                        {safeEuros(data.premios.terceroEuros)} €
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    value={data.premios.porcentajeTercero}
                                    onChange={(e) => handlePremioChange('porcentajeTercero', Number(e.target.value))}
                                    className="w-full bg-black/50 border border-neon-blue/30 rounded px-3 py-2 text-white"
                                />
                            </div>

                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-neon-blue text-black font-bold py-3 rounded hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                    >
                        Guardar Cambios
                    </button>
                </div>

                <ConfigPanel
                    isOpen={isConfigOpen}
                    onClose={() => setIsConfigOpen(false)}
                    stats={{ remaining: data.jugadores, totalChips: data.fichasJugadores + data.bonusDealer, averageStack: 0 }}
                    structure={data.blinds || []}
                    onSave={handleStructureSave}
                    onResetDefaults={handleResetDefaults}
                />
            </div>
        </div>
    );
};
