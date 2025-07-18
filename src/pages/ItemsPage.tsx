import React, { useMemo } from 'react';
import { ITEMS } from '../constants';
import { isWeapon, isArmor } from '../types';
import Section from '../components/ui/Section';

const ItemsPage = () => {
    const allItems = useMemo(() => Object.values(ITEMS), []);

    return (
        <Section title="Arsenal do Crepúsculo">
            <p className="text-slate-300 leading-relaxed mb-6">
                Uma lista de equipamentos, armas e artefatos encontrados nas terras do crepúsculo.
            </p>
            <div className="space-y-4">
                {allItems.map(item => (
                    <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-amber-200">{item.name}</h4>
                        <p className="text-slate-400 text-sm italic mb-2">{item.description}</p>
                        {isWeapon(item) && <p className="text-sky-300 text-sm">Bônus de Dano: +{item.damageBonus}</p>}
                        {isArmor(item) && <p className="text-emerald-300 text-sm">Bônus de Defesa: +{item.defenseBonus}</p>}
                    </div>
                ))}
            </div>
        </Section>
    );
};
export default ItemsPage;