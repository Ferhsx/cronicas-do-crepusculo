import React from 'react';
import { ECOS } from '../constants';
import Section from '../components/ui/Section';

const EcosPage = () => {
    return (
        <Section title="Ecos do Crepúsculo">
            <p className="text-slate-300 leading-relaxed mb-6">
                Ecos são fragmentos de poder, memórias ou anomalias mágicas que podem ser canalizadas por aqueles com afinidade ao sobrenatural.
            </p>
            <div className="space-y-4">
                {ECOS.map(eco => (
                    <div key={eco.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-amber-200">{eco.name}</h4>
                            {eco.cost && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{eco.cost}</span>}
                        </div>
                        <p className="text-slate-400 text-sm mt-2">{eco.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default EcosPage;