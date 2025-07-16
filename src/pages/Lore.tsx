
import React from 'react';
import { Section } from '../App';

const Lore = () => {
    return (
        <div className="space-y-6">
            <Section title="Conceito Central: O Mundo que Esqueceu o Dia">
                <p className="text-slate-300 leading-relaxed text-lg">
                    O reino vive em crepúsculo perpétuo há 300 anos. O sol parou no horizonte, criando um
                    mundo dividido entre a <strong className="text-sky-300">Terra do Poente (oeste)</strong> - onde dragões de gelo governam castelos
                    cristalizados, e a <strong className="text-orange-400">Terra do Nascente (leste)</strong> - onde criaturas de luz corrompida comandam
                    cidades em chamas eternas. No centro, a <strong className="text-slate-400">Faixa Cinzenta</strong> onde a humanidade ainda
                    resiste.
                </p>
            </Section>
             <Section title="As Terras do Crepúsculo">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                         <h3 className="font-cinzel text-xl text-sky-300">Terra do Poente</h3>
                         <p className="text-slate-400 mt-2">Um domínio de frio eterno e beleza mortal. Castelos de gelo, esculpidos por dragões ancestrais, perfuram o céu escuro. A luz fraca do crepúsculo reflete em superfícies cristalizadas, criando um espetáculo de luz fantasmagórica. Aqui, o tempo parece tão congelado quanto a paisagem.</p>
                    </div>
                     <div>
                         <h3 className="font-cinzel text-xl text-slate-300">A Faixa Cinzenta</h3>
                         <p className="text-slate-400 mt-2">O bastião da humanidade. Cidades e vilas se aninham em vales e planícies, sempre sob a sombra do sol paralisado. É uma terra de resiliência e desespero, onde as pessoas lutam para manter vivas as memórias do dia e as tradições de um mundo que não existe mais. A intriga política e os segredos sombrios são tão perigosos quanto as criaturas que espreitam nas fronteiras.</p>
                    </div>
                     <div>
                         <h3 className="font-cinzel text-xl text-orange-400">Terra do Nascente</h3>
                         <p className="text-slate-400 mt-2">Uma paisagem infernal de cidades em chamas perpétuas. Criaturas de luz, antes benevolentes, foram corrompidas pela estagnação do sol, tornando-se tiranos de fogo e cinzas. O ar é espesso com fumaça e o som de lamentos ecoa pelas ruas incandescentes.</p>
                    </div>
                </div>
             </Section>
        </div>
    )
};

export default Lore;
