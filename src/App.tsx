// src/App.tsx (Versão Corrigida)

import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import MainLayout from './components/MainLayout';
import CharacterSheet from './pages/CharacterSheet';
import CharacterSheet, { getInitialCharacter } from './pages/CharacterSheet'; // Importa o componente e a função de criação
import type { Character } from './types';
import { getSharedCharacter } from './service/characterService';

    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-lg animate-fade-in ${className}`}>
        <h2 className="font-cinzel text-2xl font-bold text-amber-300/90 border-b border-slate-700 pb-3 mb-4">{title}</h2>
        {children}
    </div>
);

export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loadedCharacter, setLoadedCharacter] = useState<Character | null>(null);
    // Única fonte da verdade: o personagem ativo no momento. Pode ser null.
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCharId = urlParams.get('id');

            if (sharedCharId) {
                // Cenário 1: Há um ID na URL, então carregamos a ficha compartilhada.
                const characterData = await getSharedCharacter(sharedCharId);
                if (characterData) {
                    setLoadedCharacter(characterData);
                    setActiveCharacter(characterData);
                } else {
                    alert("O link da ficha é inválido ou a ficha foi removida.");
                    window.history.replaceState({}, '', window.location.pathname);
                    if (loggedInUser) setCurrentUser(loggedInUser);
                }
            } else {
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) setCurrentUser(loggedInUser);
                        setActiveCharacter(getInitialCharacter(loggedInUser));
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    useEffect(() => {
        // Apenas salva se o personagem não veio de um link compartilhado
        const urlParams = new URLSearchParams(window.location.search);
        const isSharedLink = urlParams.get('id');
        
        if (activeCharacter && activeCharacter.player && !isSharedLink) {
            localStorage.setItem(`character_sheet_${activeCharacter.player}`, JSON.stringify(activeCharacter));
    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim();
        if (sanitizedUser) {
            localStorage.setItem('currentUser', sanitizedUser);
            setCurrentUser(sanitizedUser);
                setActiveCharacter(JSON.parse(savedData));
            } else {
                setActiveCharacter(getInitialCharacter(sanitizedUser));
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setLoadedCharacter(null); // Limpa também a ficha compartilhada
        window.history.replaceState({}, '', window.location.pathname);
        setActiveCharacter(null); // Limpa o personagem ativo
        window.history.replaceState({}, '', window.location.pathname); // Limpa a URL
    };
    
    // --- LÓGICA DE RENDERIZAÇÃO ---

    if (isLoading) {
        return <div className="bg-slate-900 text-white h-screen flex justify-center items-center">Carregando...</div>;
    }

    // Se um personagem foi carregado pela URL, mostre a ficha dele.
    if (loadedCharacter) {
        return (
                <CharacterSheet user={loadedCharacter.player} initialCharacterData={loadedCharacter} />
            </MainLayout>
        // AQUI ESTÁ A CORREÇÃO PRINCIPAL
            </MainLayout>
        );
    }

    // Se não há nem ficha da URL nem usuário logado, mostre o login.
    return <LoginScreen onLogin={handleLogin} />;
        </MainLayout>
    );
}