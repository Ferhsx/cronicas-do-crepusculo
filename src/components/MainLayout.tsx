// src/components/MainLayout.tsx (Versão Simplificada e Corrigida)
import React from 'react';
import Navigation, { Page } from './Navigation';

export interface MainLayoutProps {
    user: string;
    onLogout: () => void;
    activePage: Page;
    setActivePage: (page: Page) => void;
    children: React.ReactNode; // Agora ele aceita 'children'
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, activePage, setActivePage, children }) => {
    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8 animate-fade-in relative">
                <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-300 tracking-wider [text-shadow:0_0_12px_rgba(252,211,77,0.5)]">Crônicas do Crepúsculo Eterno</h1>
                <p className="text-slate-400 mt-2 text-lg">Sistema de RPG Medieval Fantástico para One Shot</p>
                 <div className="absolute top-0 right-0 text-right">
                    <p className="text-slate-300">Jogador: <span className="font-bold text-amber-300">{user}</span></p>
                    <button onClick={onLogout} className="text-sm text-sky-400 hover:text-sky-300 hover:underline">
                        Sair
                    </button>
                </div>
            </header>
            <Navigation activePage={activePage} setActivePage={setActivePage} />
            <main className="max-w-7xl mx-auto mt-8">
                {children} {/* O conteúdo da página será renderizado aqui */}
            </main>
        </div>
    );
}

export default MainLayout;