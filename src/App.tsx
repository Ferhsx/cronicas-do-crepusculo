// src/App.tsx (Versão Corrigida)

import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import MainLayout from './components/MainLayout';
import CharacterSheet from './pages/CharacterSheet';
import type { Character } from './types';
import { getSharedCharacter } from './service/characterService';

export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loadedCharacter, setLoadedCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCharId = urlParams.get('id');

            if (sharedCharId) {
                const characterData = await getSharedCharacter(sharedCharId);
                if (characterData) {
                    setLoadedCharacter(characterData);
                    setCurrentUser(characterData.player);
                } else {
                    alert("O link da ficha é inválido ou a ficha foi removida. Redirecionando para a tela de login.");
                    window.history.replaceState({}, '', window.location.pathname);
                    const loggedInUser = localStorage.getItem('currentUser');
                    if (loggedInUser) setCurrentUser(loggedInUser);
                }
            } else {
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) setCurrentUser(loggedInUser);
            }
            setIsLoading(false);
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
        setLoadedCharacter(null); 
        window.history.replaceState({}, '', window.location.pathname);
    };

    if (isLoading) {
        return <div className="bg-slate-900 text-white h-screen flex justify-center items-center">Carregando...</div>;
    }
    // Se há uma ficha carregada da URL, mostre a ficha do personagem.
    if (loadedCharacter) {
        return (
            <MainLayout onLogout={handleLogout} user={loadedCharacter.player}>
                <CharacterSheet user={loadedCharacter.player} initialCharacterData={loadedCharacter} />
            </MainLayout>
        );
    }

    // Se não há ficha da URL, mas há um usuário logado, mostre a ficha do localStorage.
    if (currentUser) {
        // AQUI ESTÁ A CORREÇÃO PRINCIPAL
        return (
            <MainLayout onLogout={handleLogout} user={currentUser}>
                {/* 
                  Renderizamos o CharacterSheet passando `null` para initialCharacterData.
                  Isso fará com que o CharacterSheet use a lógica do localStorage.
                */}
                <CharacterSheet user={currentUser} initialCharacterData={null} />
            </MainLayout>
        );
    }

    // Se não há nem ficha da URL nem usuário logado, mostre o login.
    return <LoginScreen onLogin={handleLogin} />;
}