
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainLayout from './components/MainLayout';
import type { Character } from './types';
import LZString from 'lz-string';

export type Page = 'lore' | 'rules' | 'archetypes' | 'sheet';

export const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-lg animate-fade-in ${className}`}>
        <h2 className="font-cinzel text-2xl font-bold text-amber-300/90 border-b border-slate-700 pb-3 mb-4">{title}</h2>
        {children}
    </div>
);


export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loadedCharacter, setLoadedCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedCharData = urlParams.get('char');

        if (sharedCharData) {
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(sharedCharData);
                if(decompressed) {
                    const characterData: Character = JSON.parse(decompressed);
                    setLoadedCharacter(characterData);
                    setCurrentUser(characterData.player); // "Log in" as the character's player
                } else {
                    const loggedInUser = localStorage.getItem('currentUser');
                    if (loggedInUser) {
                        setCurrentUser(loggedInUser);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar ficha compartilhada:", error);
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) {
                    setCurrentUser(loggedInUser);
                }
            }
        } else {
            const loggedInUser = localStorage.getItem('currentUser');
            if (loggedInUser) {
                setCurrentUser(loggedInUser);
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim();
        if(sanitizedUser) {
            localStorage.setItem('currentUser', sanitizedUser);
            setCurrentUser(sanitizedUser);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        // Clean up the URL so the shared character doesn't reload on logout
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <p className="text-xl text-slate-400 font-cinzel">Carregando...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <MainLayout user={currentUser} onLogout={handleLogout} initialCharacterData={loadedCharacter} />;
}
