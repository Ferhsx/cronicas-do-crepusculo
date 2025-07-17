// src/App.tsx (Versão Corrigida)

import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import MainLayout from './components/MainLayout';
import CharacterSheet, { getInitialCharacter } from './pages/CharacterSheet'; // Importa o componente e a função de criação
import type { Character } from './types';
import { getSharedCharacter } from './service/characterService';

export default function App() {
    // Única fonte da verdade: o personagem ativo no momento. Pode ser null.
    const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Efeito que roda apenas uma vez para carregar os dados iniciais
    useEffect(() => {
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCharId = urlParams.get('id');

            if (sharedCharId) {
                // Cenário 1: Há um ID na URL, então carregamos a ficha compartilhada.
                const characterData = await getSharedCharacter(sharedCharId);
                if (characterData) {
                    setActiveCharacter(characterData);
                } else {
                    alert("O link da ficha é inválido ou a ficha foi removida.");
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } else {
                // Cenário 2: Não há ID na URL, então tentamos carregar do localStorage.
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) {
                    const savedData = localStorage.getItem(`character_sheet_${loggedInUser}`);
                    if (savedData) {
                        setActiveCharacter(JSON.parse(savedData));
                    } else {
                        // Se o usuário está logado mas não tem ficha salva, criamos uma nova para ele.
                        setActiveCharacter(getInitialCharacter(loggedInUser));
                    }
                }
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    // Efeito que salva automaticamente no localStorage sempre que a ficha muda.
    useEffect(() => {
        // Apenas salva se o personagem não veio de um link compartilhado
        const urlParams = new URLSearchParams(window.location.search);
        const isSharedLink = urlParams.get('id');
        
        if (activeCharacter && activeCharacter.player && !isSharedLink) {
            localStorage.setItem(`character_sheet_${activeCharacter.player}`, JSON.stringify(activeCharacter));
        }
    }, [activeCharacter]);


    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim();
        if (sanitizedUser) {
            localStorage.setItem('currentUser', sanitizedUser);
            // Tenta carregar a ficha do usuário ou cria uma nova.
            const savedData = localStorage.getItem(`character_sheet_${sanitizedUser}`);
            if (savedData) {
                setActiveCharacter(JSON.parse(savedData));
            } else {
                setActiveCharacter(getInitialCharacter(sanitizedUser));
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setActiveCharacter(null); // Limpa o personagem ativo
        window.history.replaceState({}, '', window.location.pathname); // Limpa a URL
    };
    
    // --- LÓGICA DE RENDERIZAÇÃO ---

    if (isLoading) {
        return <div className="bg-slate-900 text-white h-screen flex justify-center items-center">Carregando...</div>;
    }

    if (!activeCharacter) {
        // Se, após o carregamento, não há personagem ativo (nem do link, nem do login), mostra a tela de login.
        return <LoginScreen onLogin={handleLogin} />;
    }

    // Se chegamos aqui, significa que HÁ um personagem ativo. Mostramos a ficha!
    return (
        <MainLayout onLogout={handleLogout} user={activeCharacter.player}>
            <CharacterSheet character={activeCharacter} setCharacter={setActiveCharacter} />
        </MainLayout>
    );
}