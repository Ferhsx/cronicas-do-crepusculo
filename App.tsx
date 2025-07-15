
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainLayout from './components/MainLayout';

export type Page = 'lore' | 'rules' | 'archetypes' | 'sheet';

export const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-lg animate-fade-in ${className}`}>
        <h2 className="font-cinzel text-2xl font-bold text-amber-300/90 border-b border-slate-700 pb-3 mb-4">{title}</h2>
        {children}
    </div>
);


export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
        }
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
    };

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <MainLayout user={currentUser} onLogout={handleLogout} />;
}