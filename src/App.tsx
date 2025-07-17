// src/App.tsx (Versão Final com Roteamento)

import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './pages/LoginScreen';
import MainLayout from './components/MainLayout';
import CharacterSheet, { getInitialCharacter } from './pages/CharacterSheet';
import Lore from './pages/Lore';
import Rules from './pages/Rules';
import Archetypes from './pages/Archetypes';
import type { Character } from './types';
import { getSharedCharacter } from './service/characterService';
import type { Page } from './components/Navigation'; // Importa o tipo 'Page' do Navigation

export default function App() {
    const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activePage, setActivePage] = useState<Page>('lore');

    useEffect(() => {
        const loadData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedCharId = urlParams.get('id');

            if (sharedCharId) {
                const characterData = await getSharedCharacter(sharedCharId);
                if (characterData) {
                    setActiveCharacter(characterData);
                    setActivePage('sheet'); // Se carregar uma ficha, define a página ativa para 'sheet'
                } else {
                    alert("O link da ficha é inválido ou a ficha foi removida.");
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } else {
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser) {
                    const savedData = localStorage.getItem(`character_sheet_${loggedInUser}`);
                    setActiveCharacter(savedData ? JSON.parse(savedData) : getInitialCharacter(loggedInUser));
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isSharedLink = urlParams.get('id');
        if (activeCharacter && activeCharacter.player && !isSharedLink) {
            localStorage.setItem(`character_sheet_${activeCharacter.player}`, JSON.stringify(activeCharacter));
        }
    }, [activeCharacter]);

    const handleSetCharacter: React.Dispatch<React.SetStateAction<Character>> = useCallback((value) => {
        // Esta função wrapper lida com os dois tipos de atualização de estado do React
        if (typeof value === 'function') {
            // Caso 1: setCharacter(prevState => ...)
            // O 'value' aqui é a função (prevState: Character) => Character
            setActiveCharacter(prev => {
                // 'prev' aqui é do tipo Character | null
                if (prev === null) {
                    // Se o estado anterior for nulo, não podemos atualizá-lo.
                    // Esta é uma guarda de segurança que satisfaz o TypeScript.
                    return null;
                }
                // Se não for nulo, podemos chamar a função de atualização com segurança.
                return value(prev);
            });
        } else {
            // Caso 2: setCharacter(newCharacter)
            // 'value' aqui é um objeto Character completo. É seguro passá-lo diretamente.
            setActiveCharacter(value);
        }
    }, []); // A dependência vazia está correta, pois setActiveCharacter é estável.

    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim();
        if (sanitizedUser) {
            localStorage.setItem('currentUser', sanitizedUser);
            const savedData = localStorage.getItem(`character_sheet_${sanitizedUser}`);
            setActiveCharacter(savedData ? JSON.parse(savedData) : getInitialCharacter(sanitizedUser));
            setActivePage('sheet'); // Após o login, leva para a ficha
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setActiveCharacter(null);
        window.history.replaceState({}, '', window.location.pathname);
    };

    // Função que decide qual componente de página renderizar
    const renderPage = (character: Character) => {
        switch (activePage) {
            case 'lore': return <Lore />;
            case 'rules': return <Rules />;
            case 'archetypes': return <Archetypes />;
            // Agora, quando renderizamos a ficha, 'character' tem o tipo correto
            // E 'setActiveCharacter' é do tipo compatível
            case 'sheet': return <CharacterSheet character={character} setCharacter={handleSetCharacter} />;
            default: return <Lore />;
        }
    };

    if (isLoading) {
        return <div className="bg-slate-900 text-white h-screen flex justify-center items-center">Carregando...</div>;
    }

    if (!activeCharacter) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <MainLayout onLogout={handleLogout} user={activeCharacter.player} activePage={activePage} setActivePage={setActivePage}>
            {renderPage(activeCharacter)}
        </MainLayout>
    );
}