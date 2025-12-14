import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-4">
            <div className="bg-black/50 border border-neon-blue/30 p-8 rounded-xl max-w-md w-full backdrop-blur-sm">
                <h2 className="text-2xl font-orbitron text-neon-blue mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-inter text-gray-400 mb-1">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/30 border border-neon-blue/30 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-inter text-gray-400 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/30 border border-neon-blue/30 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-neon-blue/20 border border-neon-blue text-neon-blue py-2 rounded hover:bg-neon-blue/30 transition-colors font-bold"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};
