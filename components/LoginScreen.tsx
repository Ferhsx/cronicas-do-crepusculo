
import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-4">
             <header className="text-center mb-8 animate-fade-in">
                <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-300 tracking-wider [text-shadow:0_0_12px_rgba(252,211,77,0.5)]">Crônicas do Crepúsculo Eterno</h1>
                <p className="text-slate-400 mt-2 text-lg">Sistema de RPG Medieval Fantástico para One Shot</p>
            </header>
            <main className="w-full max-w-md animate-fade-in">
                <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 shadow-lg space-y-6">
                    <h2 className="font-cinzel text-2xl font-bold text-amber-300/90 text-center">Entrar ou Criar Jogador</h2>
                    <div>
                        <label htmlFor="username" className="block text-slate-300 mb-2">
                            Nome do Jogador
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu nome..."
                            className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-lg"
                        />
                         <p className="text-xs text-slate-500 mt-2">Este nome será usado para salvar sua ficha de personagem neste navegador.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed text-lg"
                    >
                        Continuar
                    </button>
                </form>
            </main>
        </div>
    );
};

export default LoginScreen;
