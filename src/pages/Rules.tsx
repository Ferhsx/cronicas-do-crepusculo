import React from 'react';
import Section from '../components/ui/Section';
import { DIFFICULTIES, PENUMBRA_EFFECTS, FACTIONS } from '../constants';
import { FLAME_KEYS } from '../types';

// As descrições não estão nas constantes, então criamos um mapa local.
const FLAME_DESCRIPTIONS: Record<string, string> = {
    "Chama de Ferro": "Força física e resistência",
    "Chama de Prata": "Agilidade e destreza",
    "Chama de Ouro": "Intelecto e sabedoria",
    "Chama de Jade": "Carisma e manipulação social",
    "Chama de Rubi": "Conexão com o sobrenatural",
};

const SubSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mt-6 ${className}`}>
        <h3 className="font-cinzel text-xl font-bold text-amber-200/90 mb-2">{title}</h3>
        <div className="space-y-2 text-slate-300 leading-relaxed">{children}</div>
    </div>
);

const Rules = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Section title="Mecânicas Principais">
                    <SubSection title="Sistema de Atributos: As Cinco Chamas">
                        <p>Em vez de atributos tradicionais, cada personagem possui 5 Chamas que representam aspectos da alma:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            {FLAME_KEYS.map(flame => (
                                <li key={flame}><strong>{flame}:</strong> {FLAME_DESCRIPTIONS[flame]}</li>
                            ))}
                        </ul>
                        <p className="mt-2"><strong>Valores:</strong> Cada Chama tem intensidade de 1 a 6. Na criação, os personagens distribuem 12 pontos além do valor base 1 em cada Chama (totalizando 17 pontos), com um valor máximo inicial de 4.</p>
                    </SubSection>

                    <SubSection title="Mecânica Principal: Dados de Crepúsculo">
                        <p><strong>Teste Básico:</strong> Role 2d6 + Chama relevante</p>
                        <p><strong>Dificuldades:</strong></p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            {DIFFICULTIES.map(d => <li key={d.name}>{d.name} ({d.value})</li>)}
                        </ul>
                    </SubSection>
                </Section>
                
                <Section title="Sistema de Penumbra">
                     <p>Cada personagem tem uma Barra de Penumbra (0-10). Conforme a Penumbra aumenta, a escuridão interior se manifesta:</p>
                     <ul className="list-disc list-inside space-y-1 pl-4">
                        {PENUMBRA_EFFECTS.map(effect => (
                            <li key={effect.range}><strong>{effect.range}:</strong> {effect.description}</li>
                        ))}
                        <li><strong>10:</strong> <strong className="text-red-400">Perdido na Escuridão</strong> - vira um NPC controlado pelo mestre, consumido por seus demônios interiores.</li>
                    </ul>
                </Section>

                 <Section title="Sistema de Combate: Dança das Sombras">
                    <SubSection title="Iniciativa">
                        <p>Role 1d6 + Chama de Prata. A ordem de ação é decrescente.</p>
                    </SubSection>
                     <SubSection title="Ações por Turno">
                        <p>Cada personagem pode realizar:</p>
                         <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>1 Ação Principal:</strong> Atacar, conjurar, usar habilidade especial.</li>
                            <li><strong>1 Ação Menor:</strong> Mover, sacar arma, falar.</li>
                            <li><strong>Reações:</strong> Defender, contra-atacar (se uma habilidade permitir).</li>
                        </ul>
                    </SubSection>
                     <SubSection title="Dano e Defesa">
                         <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>Ataque:</strong> 2d6 + Chama relevante + bônus da arma</li>
                            <li><strong>Defesa:</strong> 2d6 + Chama de Prata + bônus da armadura</li>
                            <li><strong>Dano:</strong> Diferença positiva entre o resultado do Ataque e da Defesa.</li>
                            <li><strong>Pontos de Vida:</strong> 20 + (Chama de Ferro x 3)</li>
                        </ul>
                    </SubSection>
                     <SubSection title="Regra Especial: Golpes Crepusculares">
                        <p>Em cada ataque em combate, role um d6 extra (o Dado Crepuscular) para determinar um efeito adicional:</p>
                         <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>1-2:</strong> Golpe normal.</li>
                            <li><strong>3-4:</strong> O golpe ganha +1d6 de dano, mas o personagem ganha +1 Penumbra.</li>
                            <li><strong>5-6:</strong> Golpe crítico (dano total é dobrado), mas o personagem ganha +2 Penumbra.</li>
                        </ul>
                    </SubSection>
                </Section>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Section title="Criação de Personagem: Ritual de Despertar">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                        <li>Distribua 12 pontos entre as 5 Chamas (valor mínimo 1, máximo 4 na criação).</li>
                        <li>Escolha um Arquétipo e anote suas habilidades.</li>
                        <li>Defina sua Origem.</li>
                        <li>Calcule as estatísticas derivadas (HP, Penumbra inicial).</li>
                        <li>Escolha um Segredo Sombrio (algo que, se descoberto, aumenta sua Penumbra).</li>
                    </ol>
                </Section>
                <Section title="Mecânicas Sociais: Política das Sombras">
                     <SubSection title="Níveis de Influência">
                        <p>Cada personagem tem níveis de influência com as facções:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                           {Object.values(FACTIONS).map(factionName => <li key={String(factionName)}>{String(factionName)}</li>)}
                        </ul>
                    </SubSection>
                    <SubSection title="Testes Sociais">
                         <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>Persuasão:</strong> 2d6 + Jade + Influência</li>
                            <li><strong>Intimidação:</strong> 2d6 + Ferro + Penumbra atual</li>
                            <li><strong>Enganação:</strong> 2d6 + Prata + metade da Penumbra (arredondado para baixo)</li>
                        </ul>
                    </SubSection>
                </Section>
            </div>
        </div>
    );
}

export default Rules;