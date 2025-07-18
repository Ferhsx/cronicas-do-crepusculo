import React from 'react';
import { ORIGINS } from '../constants';
import Section from '../components/ui/Section';

const OriginsPage = () => {
    return (
        <div className="space-y-6">
            <Section title="Origens Disponíveis">
                <p className="text-slate-300 leading-relaxed mb-6">
                    Sua origem define seu passado e concede um benefício único que molda seu personagem desde o início.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ORIGINS.map(origin => (
                        <div key={origin.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="font-cinzel text-xl text-amber-300">{origin.name}</h3>
                            <p className="text-slate-400 mt-2"><strong>Benefício:</strong> {origin.benefit}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default OriginsPage;