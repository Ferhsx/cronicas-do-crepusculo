import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import MainLayout from './components/MainLayout';
import CharacterSheet from './pages/CharacterSheet'; // Corrigido: import do CharacterSheet
import type { Character } from './types';
import { getSharedCharacter } from './service/characterService';

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
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCharId = urlParams.get('id'); // Pega o 'id' da URL, se existir

            if (sharedCharId) {
                // Se um ID foi encontrado na URL, tente carregar a ficha compartilhada
                const characterData = await getSharedCharacter(sharedCharId);
                if (characterData) {
                    setLoadedCharacter(characterData);
                    setCurrentUser(characterData.player); // Define o usuário logado com base na ficha
                } else {
                    // O link é inválido ou a ficha não existe mais
                    alert("O link da ficha é inválido ou a ficha foi removida. Redirecionando para a tela de login.");
                    window.history.replaceState({}, '', window.location.pathname); // Limpa a URL
                    const loggedInUser = localStorage.getItem('currentUser');
                    if (loggedInUser) setCurrentUser(loggedInUser);
                }
            } else {
                // Se não há ID na URL, use a lógica de login normal (via localStorage)
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) setCurrentUser(loggedInUser);
            }
            setIsLoading(false); // Termina o carregamento
        };

        loadData();
    }, []);

    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim();
        if (sanitizedUser) {
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
        return <div className="bg-slate-900 text-white h-screen flex justify-center items-center">Carregando...</div>;
    }

    // Se um personagem foi carregado (pela URL), mostre a ficha direto
    if (loadedCharacter) {
        return (
            <MainLayout onLogout={handleLogout} user={currentUser ?? ''}>
                <CharacterSheet user={currentUser ?? ''} initialCharacterData={loadedCharacter} />
            </MainLayout>
        );
    }

    // Se nenhum usuário está logado E nenhum personagem foi carregado pela URL, mostre o login
    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <MainLayout user={currentUser ?? ''} onLogout={handleLogout} initialCharacterData={loadedCharacter} />;
}
