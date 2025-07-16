
import React from 'react';
import { ARCHETYPES } from '../constants';
import { Archetype, Flame } from '../types';
import { IronFlameIcon, SilverFlameIcon, GoldFlameIcon, JadeFlameIcon, RubyFlameIcon } from '../icons';

const FLAME_ICONS: Record<Flame, React.FC> = {
    [Flame.Ferro]: IronFlameIcon,
    [Flame.Prata]: SilverFlameIcon,
    [Flame.Ouro]: GoldFlameIcon,
    [Flame.Jade]: JadeFlameIcon,
    [Flame.Rubi]: RubyFlameIcon,
};

const ArchetypeCard: React.FC<{ archetype: Archetype }> = ({ archetype }) => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-lg h-full flex flex-col animate-fade-in">
            <h2 className="font-cinzel text-2xl font-bold text-amber-300/90 border-b border-slate-700 pb-3 mb-4">{archetype.name}</h2>
            <p className="italic text-slate-400 mb-4">{archetype.concept}</p>
            
            <div className="mb-4">
                <h3 className="font-bold text-amber-200 mb-2">Chamas Fortes</h3>
                <div className="flex space-x-4">
                    {archetype.strongFlames.map(flame => (
                        <div key={flame} className="flex items-center space-x-2 text-slate-300">
                            {React.createElement(FLAME_ICONS[flame])}
                            <span>{flame.split(' ')[2]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-amber-200">Habilidade Especial</h3>
                <p className="text-slate-300">{archetype.specialAbility}</p>
            </div>
            
            <div className="mb-4">
                <h3 className="font-bold text-amber-200">Equipamento</h3>
                <p className="text-slate-300">{archetype.equipmentDesc}</p>
            </div>
        </div>
    );
};

const Archetypes = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARCHETYPES.map(archetype => (
                <ArchetypeCard key={archetype.id} archetype={archetype} />
            ))}
        </div>
    );
};

export default Archetypes;
