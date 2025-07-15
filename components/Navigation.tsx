
import React from 'react';
import { Page } from '../App';


interface NavButtonProps {
    page: Page;
    label: string;
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ page, label, activePage, setActivePage }) => {
    const isActive = activePage === page;
    return (
        <button
            onClick={() => setActivePage(page)}
            className={`px-3 sm:px-4 py-2 font-cinzel text-base sm:text-lg rounded-t-md transition-all duration-300 ${isActive ? 'bg-slate-800/60 text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/30'}`}
        >
            {label}
        </button>
    );
};

interface NavigationProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePage, setActivePage }) => {
    return (
        <nav className="flex justify-center border-b border-slate-700 animate-fade-in">
            <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
                <NavButton page="lore" label="O Mundo" activePage={activePage} setActivePage={setActivePage} />
                <NavButton page="rules" label="Regras" activePage={activePage} setActivePage={setActivePage} />
                <NavButton page="archetypes" label="Arquétipos" activePage={activePage} setActivePage={setActivePage} />
                <NavButton page="sheet" label="Ficha Interativa" activePage={activePage} setActivePage={setActivePage} />
            </div>
        </nav>
    );
};

export default Navigation;
