import React, { useState, useMemo, useCallback } from 'react';
import { Character, Flame, Archetype, Origin, Difficulty, FLAME_KEYS, EquipmentItem, isWeapon, isArmor, Weapon, Armor, RollResult, Eco } from '../types';
import { ARCHETYPES, ORIGINS, INITIAL_POINTS_TO_DISTRIBUTE, MIN_FLAME_START, MAX_FLAME_START, MAX_PENUMBRA, BASE_HP, DIFFICULTIES, PENUMBRA_EFFECTS, FACTIONS, ITEMS, ECOS} from '../constants';
import { IronFlameIcon, SilverFlameIcon, GoldFlameIcon, JadeFlameIcon, RubyFlameIcon } from '../icons';
import { saveCharacterForSharing } from '../service/characterService';

// --- SUB-COMPONENTES E CONSTANTES ---

const FLAME_DETAILS: Record<Flame, { icon: React.FC, color: string, description: string }> = {
    [Flame.Ferro]: { icon: IronFlameIcon, color: 'text-red-500', description: 'Força física e resistência' },
    [Flame.Prata]: { icon: SilverFlameIcon, color: 'text-sky-400', description: 'Agilidade e destreza' },
    [Flame.Ouro]: { icon: GoldFlameIcon, color: 'text-yellow-400', description: 'Intelecto e sabedoria' },
    [Flame.Jade]: { icon: JadeFlameIcon, color: 'text-emerald-400', description: 'Carisma e manipulação social' },
    [Flame.Rubi]: { icon: RubyFlameIcon, color: 'text-rose-500', description: 'Conexão com o sobrenatural' },
};

const ImagePlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <path d="M15.5 2H8.5C6 2 4 4 4 6.5V17.5C4 20 6 22 8.5 22H15.5C18 22 20 20 20 17.5V6.5C20 4 18 2 15.5 2z"></path>
        <path d="M8 7h8"></path>
        <path d="M8 12h4"></path>
        <path d="M17 12h-2"></path>
        <path d="M8 17h8"></path>
    </svg>
);

export const getInitialCharacter = (player: string): Character => {
    const defaultArchetype = ARCHETYPES[0];
    const defaultOrigin = ORIGINS[0];

    const flames = FLAME_KEYS.reduce((acc, key) => ({ ...acc, [key]: MIN_FLAME_START }), {} as Record<Flame, number>);

    let penumbra = 0;
    let influence = { crepuscular: 0, eterna: 0, brumas: 0, alvorecer: 0 };
    
    // GARANTIA: Inicia `specialBonuses` como um array vazio.
    let specialBonuses: string[] = [];

    switch (defaultOrigin.id) {
        case 'nobre': flames[Flame.Jade] += 1; Object.keys(influence).forEach(key => influence[key as keyof typeof influence] += 1); break;
        case 'sobrevivente': flames[Flame.Prata] += 1; penumbra = 1; break;
        case 'estudioso': flames[Flame.Ouro] += 1; specialBonuses.push("Conhece 1 Eco extra"); break;
        case 'artesao': flames[Flame.Ferro] += 1; break;
    }

    // GARANTIA: Filtra quaisquer itens que possam ser undefined se o ID estiver errado em constants.ts.
    let startingInventory = defaultArchetype.startingEquipment
        .map(id => ITEMS[id] ? ({ ...ITEMS[id] }) : null) // Retorna null se o item não for encontrado
        .filter((item): item is EquipmentItem => item !== null); // Filtra os nulos de forma segura para o TypeScript

    if (defaultOrigin.id === 'artesao') {
        startingInventory = startingInventory.map(item => ({ ...item, isMagical: true }));
    }

    return {
        name: '',
        player,
        archetypeId: defaultArchetype.id,
        originId: defaultOrigin.id,
        flames,
        penumbra,
        hp: BASE_HP + flames[Flame.Ferro] * 3,
        darkSecret: '',
        history: '',
        personality: '',
        objectives: '',
        fears: '',
        notes: '',
        influence,
        inventory: startingInventory, // Agora é garantido que seja um array
        equipped: { weapon: null, armor: null },
        ecos: [], // Agora é garantido que seja um array
        specialBonuses, // Agora é garantido que seja um array
        imageUrl: '',
    };
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-lg ${className}`}>
        <h2 className="font-cinzel text-xl font-bold text-amber-300/90 border-b border-slate-700 pb-2 mb-4">{title}</h2>
        {children}
    </div>
);

const ShareCharacter: React.FC<{ character: Character }> = ({ character }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const handleShare = async () => {
        if (!character.name.trim()) { setCopySuccess('Dê um nome ao seu personagem primeiro!'); setTimeout(() => setCopySuccess(''), 3000); return; }
        setIsSharing(true);
        try {
            const characterId = await saveCharacterForSharing(character);
            const url = `${window.location.origin}${window.location.pathname}?id=${characterId}`;
            await navigator.clipboard.writeText(url);
            setCopySuccess('Link curto copiado para a área de transferência!');
        } catch (err) {
            console.error(err);
            setCopySuccess('Falha ao gerar o link. Tente novamente.');
        } finally {
            setIsSharing(false);
            setTimeout(() => setCopySuccess(''), 3000);
        }
    };
    return (
        <Section title="Compartilhar Ficha">
            <p className="text-sm text-slate-400 mb-4">Gere um link para compartilhar sua ficha. Qualquer pessoa com o link poderá ver a sua ficha atual.</p>
            <button onClick={handleShare} disabled={isSharing} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed">
                {isSharing ? 'Gerando...' : 'Gerar e Copiar Link'}
            </button>
            {copySuccess && <p className={`text-center mt-3 text-sm transition-opacity ${copySuccess.includes('Falha') || copySuccess.includes('nome') ? 'text-red-400' : 'text-green-400'}`}>{copySuccess}</p>}
        </Section>
    );
};

const TextArea: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; rows?: number }> = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-slate-300 resize-y" />
);

const DiceRoller: React.FC<{ character: Character, setCharacter: React.Dispatch<React.SetStateAction<Character>> }> = ({ character, setCharacter }) => {
    const [rollResult, setRollResult] = useState<RollResult | null>(null);
    const [selectedFlame, setSelectedFlame] = useState<Flame>(Flame.Ferro);
    const [selectedDifficulty, setSelectedDifficulty] = useState<number>(DIFFICULTIES[1].value);
    const [activeTab, setActiveTab] = useState<'test' | 'combat'>('test');

    const getPenumbraEffects = useCallback(() => {
        const p = character.penumbra;
        if (p >= 7) return { test: -2, ruby: 2 };
        if (p >= 4) return { test: -1, ruby: 1 };
        return { test: 0, ruby: 0 };
    }, [character.penumbra]);

    const rollDice = (diceCount: number) => {
        let total = 0, rolls = [];
        for (let i = 0; i < diceCount; i++) { const roll = Math.floor(Math.random() * 6) + 1; rolls.push(roll); total += roll; }
        return { total, rolls };
    };

    const handleRoll = (type: RollResult['type']) => {
        const penumbra = getPenumbraEffects();
        let result: RollResult;
        switch (type) {
            case 'Iniciativa': { const { total, rolls } = rollDice(1); const finalResult = total + character.flames[Flame.Prata]; result = { type, diceCount: 1, rolls, flameType: Flame.Prata, flameValue: character.flames[Flame.Prata], total: finalResult }; break; }
            case 'Teste': { const { total, rolls } = rollDice(2); const flameValue = character.flames[selectedFlame]; const modifier = selectedFlame === Flame.Rubi ? penumbra.ruby : penumbra.test; const finalResult = total + flameValue + modifier; result = { type, diceCount: 2, rolls, flameType: selectedFlame, flameValue, penumbraModifier: modifier, difficulty: selectedDifficulty, total: finalResult, success: finalResult >= selectedDifficulty }; break; }
            case 'Ataque': { 
                const { total: diceTotal, rolls } = rollDice(2); 
                const flameValue = character.flames[selectedFlame]; 
                const weaponBonus = character.equipped.weapon?.damageBonus ?? 0; 
                const crepuscularRoll = Math.floor(Math.random() * 6) + 1; 
                let crepuscularEffect = "Golpe Normal."; 
                let crepuscularDamageRoll: number | undefined; 

                if (crepuscularRoll >= 3 && crepuscularRoll <= 4) { 
                    const { total } = rollDice(1); 
                    crepuscularDamageRoll = total; 
                    crepuscularEffect = `+${crepuscularDamageRoll} Dano, +1 Penumbra.`; 
                    // Simplificado:
                    setCharacter(c => ({ ...c, penumbra: Math.min(MAX_PENUMBRA, c.penumbra + 1) })); 
                } else if (crepuscularRoll >= 5) { 
                    crepuscularEffect = `Dano Crítico (dobrado), +2 Penumbra.`; 
                    // Simplificado:
                    setCharacter(c => ({ ...c, penumbra: Math.min(MAX_PENUMBRA, c.penumbra + 2) })); 
                } 
                
                const finalResult = diceTotal + flameValue + weaponBonus; 
                result = { type, diceCount: 2, rolls, flameType: selectedFlame, flameValue, bonus: weaponBonus, bonusSource: character.equipped.weapon?.name, total: finalResult, crepuscularRoll, crepuscularEffect, crepuscularDamageRoll }; 
                break; 
            }
            case 'Defesa': { const { total, rolls } = rollDice(2); const flameValue = character.flames[Flame.Prata]; const armorBonus = character.equipped.armor?.defenseBonus ?? 0; const finalResult = total + flameValue + armorBonus; result = { type, diceCount: 2, rolls, flameType: Flame.Prata, flameValue, bonus: armorBonus, bonusSource: character.equipped.armor?.name, total: finalResult }; break; }
        }
        setRollResult(result);
    };

    const renderResult = () => {
        if (!rollResult) return null;
        const { type, total, success, rolls, flameType, flameValue, penumbraModifier, bonus, bonusSource, difficulty, crepuscularRoll, crepuscularEffect } = rollResult;
        const calculation = [`${rollResult.diceCount}d6(${rolls.join('+')})`, flameValue ? `${flameValue} ${flameType?.split(' ')[2]}` : null, bonus ? `${bonus} ${bonusSource}` : null, penumbraModifier ? `${penumbraModifier > 0 ? '+' : ''}${penumbraModifier} Penumbra` : null].filter(Boolean).join(' + ');
        const isSuccess = success === true ? 'bg-green-500/20 text-green-300 border-green-500' : success === false ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-slate-900/50 text-amber-200 border-slate-700';
        return (<div className={`p-3 rounded-md border text-center animate-fade-in ${isSuccess}`}><h4 className="font-bold text-lg">{type}: {total}</h4><p className="font-mono text-sm">{calculation}</p>{difficulty && <p className="text-xs">Dificuldade: {difficulty} - {success ? 'Sucesso!' : 'Falha'}</p>}{crepuscularRoll && <p className="text-xs mt-1 pt-1 border-t border-slate-600">Golpe Crepuscular (d6: {crepuscularRoll}): {crepuscularEffect}</p>}</div>)
    }

    const TabButton: React.FC<{ tabId: 'test' | 'combat', children: React.ReactNode }> = ({ tabId, children }) => (<button onClick={() => setActiveTab(tabId)} className={`flex-1 pb-2 font-cinzel text-lg border-b-2 ${activeTab === tabId ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}>{children}</button>);
    
    return (
        <Section title="Dados de Crepúsculo">
            <div className="flex mb-4">
                <TabButton tabId='test'>Teste</TabButton>
                <TabButton tabId='combat'>Combate</TabButton>
            </div>
            {activeTab === 'test' && (<div className="space-y-4 animate-fade-in"><div className="grid grid-cols-2 gap-4"><div><label htmlFor="flame-select" className="block text-sm font-medium text-slate-400 mb-1">Chama Relevante</label><select id="flame-select" value={selectedFlame} onChange={e => setSelectedFlame(e.target.value as Flame)} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400">{FLAME_KEYS.map(f => <option key={f} value={f}>{f}</option>)}</select></div><div><label htmlFor="difficulty-select" className="block text-sm font-medium text-slate-400 mb-1">Dificuldade</label><select id="difficulty-select" value={selectedDifficulty} onChange={e => setSelectedDifficulty(Number(e.target.value))} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400">{DIFFICULTIES.map(d => <option key={d.name} value={d.value}>{d.name} ({d.value})</option>)}</select></div></div><button onClick={() => handleRoll('Teste')} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors">Rolar Teste (2d6)</button></div>)}
            {activeTab === 'combat' && (<div className="space-y-4 animate-fade-in"><div className="text-center"><label htmlFor="combat-flame-select" className="block text-sm font-medium text-slate-400 mb-1">Chama de Ataque</label><select id="combat-flame-select" value={selectedFlame} onChange={e => setSelectedFlame(e.target.value as Flame)} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400">{[Flame.Ferro, Flame.Prata].map(f => <option key={f} value={f}>{f}</option>)}</select></div><div className="grid grid-cols-3 gap-2"><button onClick={() => handleRoll('Iniciativa')} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-2 rounded transition-colors text-sm">Iniciativa (1d6)</button><button onClick={() => handleRoll('Ataque')} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-2 rounded transition-colors text-sm">Ataque (2d6)</button><button onClick={() => handleRoll('Defesa')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded transition-colors text-sm">Defesa (2d6)</button></div></div>)}
            {rollResult && <div className="mt-4">{renderResult()}</div>}
        </Section>
    );
};

const EquipmentAndInventory: React.FC<{ character: Character, setCharacter: React.Dispatch<React.SetStateAction<Character>> }> = ({ character, setCharacter }) => {
    
    const handleEquip = (itemToEquip: EquipmentItem) => { 
        setCharacter(prev => { 
            const newInventory = prev.inventory.filter(i => i.id !== itemToEquip.id); 
            const newEquipped = { ...prev.equipped }; 
            if (isWeapon(itemToEquip)) { 
                if (prev.equipped.weapon) newInventory.push(prev.equipped.weapon); 
                newEquipped.weapon = itemToEquip; 
            } else if (isArmor(itemToEquip)) { 
                if (prev.equipped.armor) newInventory.push(prev.equipped.armor); 
                newEquipped.armor = itemToEquip; 
            } else { 
                newInventory.push(itemToEquip); 
            } 
            return { ...prev, inventory: newInventory, equipped: newEquipped }; 
        }); 
    };
    
    const handleUnequip = (type: 'weapon' | 'armor') => { 
        setCharacter(prev => { 
            const itemToUnequip = prev.equipped[type]; 
            if (!itemToUnequip) return prev; 
            const newInventory = [...prev.inventory, itemToUnequip]; 
            const newEquipped = { ...prev.equipped, [type]: null }; 
            return { ...prev, inventory: newInventory, equipped: newEquipped }; 
        }); 
    };
    
    const handleDelete = (itemId: string) => { 
        setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== itemId) })); 
    }
    
    const EquippedItem: React.FC<{ label: string, item: Weapon | Armor | null, onUnequip: () => void }> = ({ label, item, onUnequip }) => (
        <div>
            <h4 className="font-bold text-slate-300">{label}</h4>
            {item ? (
                <div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                    <div>
                        <p>{item.name} {item.isMagical && <span className="text-xs text-amber-300">(Mágico)</span>}</p>
                        <p className="text-xs text-amber-300">{isWeapon(item) && `+${item.damageBonus} Dano`}{isArmor(item) && `+${item.defenseBonus} Defesa`}</p>
                    </div>
                    <button onClick={onUnequip} className="text-xs bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded">Desequipar</button>
                </div>
            ) : <p className="text-slate-400 text-sm p-2">Nenhum</p>}
        </div>
    );
    
    return (
        <Section title="Equipamento e Inventário">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EquippedItem label="Arma Equipada" item={character.equipped.weapon} onUnequip={() => handleUnequip('weapon')} />
                    <EquippedItem label="Armadura Equipada" item={character.equipped.armor} onUnequip={() => handleUnequip('armor')} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-300 mb-2">Inventário</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {(character.inventory || []).length > 0 ? (character.inventory || []).map(item => (
    <div key={item.id} className="flex items-center justify-between bg-slate-900/60 p-2 rounded-md">
        <div>
            <p>{item.name} {item.isMagical && <span className="text-xs text-amber-300">(Mágico)</span>}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
        </div>
        <div className="flex items-center space-x-1">
            {(isWeapon(item) || isArmor(item)) && <button onClick={() => handleEquip(item)} className="text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded">Equipar</button>}
            <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-800 hover:bg-red-700 px-2 py-1 rounded">X</button>
        </div>
    </div>
)) : <p className="text-slate-400 text-sm">Inventário vazio.</p>}
                    </div>
                </div>
            </div>
        </Section>
    );
}

// NOVO SUB-COMPONENTE PARA GERENCIAR ECOS
const EcosSection: React.FC<{ character: Character, setCharacter: React.Dispatch<React.SetStateAction<Character>> }> = ({ character, setCharacter }) => {
    const [selectedEcoId, setSelectedEcoId] = useState<string>(ECOS[0]?.id || '');
    const [customEco, setCustomEco] = useState({ name: '', description: '', cost: '' });

    const handleRemoveEco = (ecoIdToRemove: string) => {
        setCharacter(prev => ({ ...prev, ecos: prev.ecos.filter(eco => eco.id !== ecoIdToRemove) }));
    };

    const handleAddEcoFromList = () => {
        if (!selectedEcoId) return;
        const ecoToAdd = ECOS.find(e => e.id === selectedEcoId);
        if (ecoToAdd && !character.ecos.some(e => e.id === ecoToAdd.id)) {
            setCharacter(prev => ({ ...prev, ecos: [...prev.ecos, ecoToAdd] }));
        }
    };

    const handleAddCustomEco = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customEco.name.trim() || !customEco.description.trim()) {
            alert("Nome e Descrição são obrigatórios para um eco personalizado.");
            return;
        }
        const newCustomEco: Eco = {
            ...customEco,
            id: `custom_${Date.now()}`,
            isCustom: true,
        };
        setCharacter(prev => ({ ...prev, ecos: [...prev.ecos, newCustomEco] }));
        setCustomEco({ name: '', description: '', cost: '' });
    };

    return (
        <Section title="Ecos & Poderes">
            <div className="space-y-3">
                {(character.ecos || []).length > 0 ? (character.ecos || []).map(eco => (
                    <div key={eco.id} className="bg-slate-900/60 p-3 rounded-md border border-slate-700 relative group">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-amber-200">{eco.name}</h4>
                            {eco.cost && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">{eco.cost}</span>}
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{eco.description}</p>
                        <button 
                            onClick={() => handleRemoveEco(eco.id)} 
                            className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-red-900/50 rounded-full w-5 h-5 flex items-center justify-center"
                            aria-label="Remover Eco"
                        >
                            X
                        </button>
                    </div>
                )) : <p className="text-slate-500 text-sm italic">Nenhum eco conhecido.</p>}
            </div>

            <div className="border-t border-slate-700 my-4"></div>

            <div className="space-y-2">
                <h4 className="font-bold text-slate-300">Adicionar Eco Conhecido</h4>
                <div className="flex space-x-2">
                    <select
                        value={selectedEcoId}
                        onChange={e => setSelectedEcoId(e.target.value)}
                        className="flex-grow bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        {ECOS.map(eco => <option key={eco.id} value={eco.id}>{eco.name}</option>)}
                    </select>
                    <button onClick={handleAddEcoFromList} className="bg-sky-700 hover:bg-sky-600 text-white font-bold px-4 rounded transition-colors">+</button>
                </div>
            </div>

            <form onSubmit={handleAddCustomEco} className="space-y-2 mt-4">
                <h4 className="font-bold text-slate-300">Adicionar Eco Personalizado</h4>
                <input type="text" placeholder="Nome do Eco" value={customEco.name} onChange={e => setCustomEco(c => ({ ...c, name: e.target.value }))} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2" />
                <input type="text" placeholder="Custo (ex: 1 Penumbra)" value={customEco.cost} onChange={e => setCustomEco(c => ({ ...c, cost: e.target.value }))} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2" />
                <textarea placeholder="Descrição do Eco" value={customEco.description} onChange={e => setCustomEco(c => ({ ...c, description: e.target.value }))} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 resize-y" rows={2}></textarea>
                <button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">Salvar Eco Personalizado</button>
            </form>
        </Section>
    );
};

// NOVO SUB-COMPONENTE PARA CONSULTA DE ITENS
const ItemDatabaseSection: React.FC<{ setCharacter: React.Dispatch<React.SetStateAction<Character>> }> = ({ setCharacter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'weapon' | 'armor' | 'item'>('all');

    const allItems = useMemo(() => Object.values(ITEMS), []);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesFilter = 
                (filter === 'all') ||
                (filter === 'weapon' && isWeapon(item)) ||
                (filter === 'armor' && isArmor(item)) ||
                (filter === 'item' && !isWeapon(item) && !isArmor(item));

            const matchesSearch = 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });
    }, [searchTerm, filter, allItems]);

    const handleAddItemToInventory = (itemToAdd: EquipmentItem) => {
        // Criamos uma nova instância do item para evitar problemas de referência
        const newItemInstance = { ...itemToAdd, id: `${itemToAdd.id}_${Date.now()}` };
        
        setCharacter(prev => ({
            ...prev,
            inventory: [...prev.inventory, newItemInstance]
        }));
    };

    const FilterButton: React.FC<{ filterType: typeof filter, label: string }> = ({ filterType, label }) => (
        <button
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === filterType ? 'bg-amber-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
            {label}
        </button>
    );

    return (
        <Section title="Arsenal do Crepúsculo">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Buscar item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2"
                />
                <div className="flex flex-wrap gap-2">
                    <FilterButton filterType="all" label="Todos" />
                    <FilterButton filterType="weapon" label="Armas" />
                    <FilterButton filterType="armor" label="Armaduras" />
                    <FilterButton filterType="item" label="Itens" />
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 border-t border-slate-700 pt-4">
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                        <div key={item.id} className="bg-slate-900/60 p-3 rounded-md relative group">
                            <h4 className="font-bold text-amber-200">{item.name}</h4>
                            <p className="text-slate-400 text-sm italic mb-1">{item.description}</p>
                            {isWeapon(item) && <p className="text-sky-300 text-xs">Bônus de Dano: +{item.damageBonus}</p>}
                            {isArmor(item) && <p className="text-emerald-300 text-xs">Bônus de Defesa: +{item.defenseBonus}</p>}
                             <button
                                onClick={() => handleAddItemToInventory(item)}
                                className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl bg-green-700 hover:bg-green-600 rounded-full w-7 h-7 flex items-center justify-center"
                                aria-label="Adicionar ao Inventário"
                                title="Adicionar ao Inventário"
                            >
                                +
                            </button>
                        </div>
                    )) : <p className="text-slate-500 text-sm italic text-center">Nenhum item encontrado.</p>}
                </div>
            </div>
        </Section>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function CharacterSheet({ character, setCharacter }: { character: Character, setCharacter: React.Dispatch<React.SetStateAction<Character>> }) {

    const [isCreating, setIsCreating] = useState(() => !character.name);

    const baseFlames = useMemo(() => {
        const flames = { ...character.flames };
        const origin = ORIGINS.find(o => o.id === character.originId);
        if (!origin) return flames;
        switch (origin.id) {
            case 'nobre': flames[Flame.Jade]--; break;
            case 'estudioso': flames[Flame.Ouro]--; break;
            case 'artesao': flames[Flame.Ferro]--; break;
            case 'sobrevivente': flames[Flame.Prata]--; break;
        }
        return flames;
    }, [character.flames, character.originId]);

    const pointsSpent = useMemo(() => {
        const totalFromBase = FLAME_KEYS.reduce((sum, key) => sum + baseFlames[key], 0);
        return totalFromBase - FLAME_KEYS.length * MIN_FLAME_START;
    }, [baseFlames]);

    const pointsRemaining = INITIAL_POINTS_TO_DISTRIBUTE - pointsSpent;

    const activeArchetype = useMemo(() => ARCHETYPES.find(a => a.id === character.archetypeId)!, [character.archetypeId]);
    const activeOrigin = useMemo(() => ORIGINS.find(o => o.id === character.originId)!, [character.originId]);

    const updateCharacterField = useCallback(<K extends keyof Character>(key: K, value: Character[K]) => {
        setCharacter(prev => ({ ...prev, [key]: value }));
    }, [setCharacter]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { alert("A imagem é muito grande. Por favor, escolha uma imagem menor que 2MB."); e.target.value = ''; return; }
        const reader = new FileReader();
        reader.onload = () => { if (typeof reader.result === 'string') updateCharacterField('imageUrl', reader.result); };
        reader.onerror = (error) => console.error("Erro ao ler a imagem:", error);
        reader.readAsDataURL(file);
    };

    const handleFlameChange = useCallback((flame: Flame, change: number) => {
        if (!isCreating) return;
        if (change > 0 && pointsRemaining <= 0) return;
        const currentBaseValue = baseFlames[flame];
        const newBaseValue = currentBaseValue + change;
        if (newBaseValue < MIN_FLAME_START || newBaseValue > MAX_FLAME_START) return;
        setCharacter(prev => {
            const newFlames = { ...prev.flames, [flame]: prev.flames[flame] + change };
            const newHp = BASE_HP + newFlames[Flame.Ferro] * 3;
            return { ...prev, flames: newFlames, hp: newHp };
        });
    }, [isCreating, pointsRemaining, baseFlames, setCharacter]);

    const handleArchetypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newArchetypeId = e.target.value;
        const newArchetype = ARCHETYPES.find(a => a.id === newArchetypeId)!;
        let startingInventory = newArchetype.startingEquipment.map(id => ({ ...ITEMS[id] })).filter(Boolean);
        if (character.originId === 'artesao') { startingInventory = startingInventory.map(item => ({ ...item, isMagical: true })); }
        setCharacter(prev => ({ ...prev, archetypeId: newArchetypeId, inventory: startingInventory, equipped: { weapon: null, armor: null } }));
    };

    const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newOriginId = e.target.value;
        setCharacter(prev => {
            const oldOrigin = ORIGINS.find(o => o.id === prev.originId)!;
            const newOrigin = ORIGINS.find(o => o.id === newOriginId)!;
            let newFlames = { ...prev.flames };
            let newPenumbra = prev.penumbra;
            let newInfluence = { ...prev.influence };
            let newSpecialBonuses = prev.specialBonuses ? [...prev.specialBonuses] : [];
            let newInventory = prev.inventory.map(item => ({ ...item }));
            switch (oldOrigin.id) {
                case 'nobre': newFlames[Flame.Jade] = Math.max(MIN_FLAME_START, newFlames[Flame.Jade] - 1); Object.keys(newInfluence).forEach(key => newInfluence[key as keyof typeof newInfluence] = Math.max(0, newInfluence[key as keyof typeof newInfluence] - 1)); break;
                case 'sobrevivente': newPenumbra = Math.max(0, newPenumbra - 1); newFlames[Flame.Prata] = Math.max(MIN_FLAME_START, newFlames[Flame.Prata] - 1); break;
                case 'estudioso': newFlames[Flame.Ouro] = Math.max(MIN_FLAME_START, newFlames[Flame.Ouro] - 1); newSpecialBonuses = newSpecialBonuses.filter(b => b !== "Conhece 1 Eco extra"); break;
                case 'artesao': newFlames[Flame.Ferro] = Math.max(MIN_FLAME_START, newFlames[Flame.Ferro] - 1); newInventory = newInventory.map(item => { delete item.isMagical; return item; }); break;
            }
            switch (newOrigin.id) {
                case 'nobre': newFlames[Flame.Jade] += 1; Object.keys(newInfluence).forEach(key => newInfluence[key as keyof typeof newInfluence] += 1); break;
                case 'sobrevivente': newPenumbra += 1; newFlames[Flame.Prata] += 1; break;
                case 'estudioso': newFlames[Flame.Ouro] += 1; if (!newSpecialBonuses.includes("Conhece 1 Eco extra")) { newSpecialBonuses.push("Conhece 1 Eco extra"); } break;
                case 'artesao': newFlames[Flame.Ferro] += 1; const archetype = ARCHETYPES.find(a => a.id === prev.archetypeId); if (archetype) { const startingIds = archetype.startingEquipment; newInventory = newInventory.map(item => { if (startingIds.includes(item.id)) { return { ...item, isMagical: true }; } return item; }) } break;
            }
            const newHp = BASE_HP + newFlames[Flame.Ferro] * 3;
            return { ...prev, originId: newOriginId, flames: newFlames, penumbra: newPenumbra, hp: newHp, influence: newInfluence, specialBonuses: newSpecialBonuses, inventory: newInventory };
        });
    };

    const handleFinalizeCreation = () => {
        if (pointsRemaining !== 0) { alert(`Você precisa usar todos os ${INITIAL_POINTS_TO_DISTRIBUTE} pontos.`); return; }
        if (!character.name.trim()) { alert('Por favor, insira o nome do personagem.'); return; }
        setIsCreating(false);
    };

    const penumbraPercentage = (character.penumbra / MAX_PENUMBRA) * 100;
    const buttonClass = "bg-slate-600 h-8 w-8 rounded-full disabled:bg-slate-700 disabled:cursor-not-allowed";
    const plusButtonClass = "bg-green-800 h-8 w-8 rounded-full disabled:bg-slate-700 disabled:cursor-not-allowed";
    const minusButtonClass = "bg-red-800 h-8 w-8 rounded-full disabled:bg-slate-700 disabled:cursor-not-allowed";
    const penumbraPlusButtonClass = "bg-purple-800 h-8 w-8 rounded-full disabled:bg-slate-700 disabled:cursor-not-allowed";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-1 space-y-6">
                <Section title="Identidade">
                    <div className="flex items-start space-x-4">
                        <div className="w-28 h-28 bg-slate-900/80 border border-slate-600 rounded-lg flex-shrink-0 group relative overflow-hidden">
                            {character.imageUrl ? (<img src={character.imageUrl} alt="Retrato do Personagem" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><ImagePlaceholderIcon /></div>)}
                            <label htmlFor="image-upload" className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Trocar</label>
                            <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <div className="flex-grow space-y-3">
                            <input type="text" placeholder="Nome do Personagem" value={character.name} onChange={e => updateCharacterField('name', e.target.value)} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-lg" />
                            <p className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 text-slate-400">Jogador: {character.player}</p>
                        </div>
                    </div>
                </Section>

                <Section title="Arquétipo">
                    <select value={character.archetypeId} onChange={handleArchetypeChange} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400" disabled={!isCreating}>
                        {ARCHETYPES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <p className="text-slate-400 text-sm">{activeArchetype.concept}</p>
                </Section>

                <Section title="Origem">
                    <select value={character.originId} onChange={handleOriginChange} className="w-full bg-slate-900/80 border border-slate-600 rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400" disabled={!isCreating}>
                        {ORIGINS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <p className="text-slate-400 text-sm"><strong>Benefício:</strong> {activeOrigin.benefit}</p>
                </Section>

                <Section title="VITAIS">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-lg">Pontos de Vida (HP)</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setCharacter(c => ({ ...c, hp: c.hp - 1 }))} className={minusButtonClass} disabled={isCreating}>-</button>
                            <span className="font-mono text-xl w-24 text-center">{character.hp} / {BASE_HP + character.flames[Flame.Ferro] * 3}</span>
                            <button onClick={() => setCharacter(c => ({ ...c, hp: c.hp + 1 }))} className={plusButtonClass} disabled={isCreating}>+</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">Penumbra</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setCharacter(c => ({ ...c, penumbra: Math.max(0, c.penumbra - 1) }))} className={buttonClass} disabled={isCreating}>-</button>
                                <span className="font-mono text-xl w-12 text-center">{character.penumbra} / {MAX_PENUMBRA}</span>
                                <button onClick={() => setCharacter(c => ({ ...c, penumbra: Math.min(MAX_PENUMBRA, c.penumbra + 1) }))} className={penumbraPlusButtonClass} disabled={isCreating}>+</button>
                            </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${penumbraPercentage}%` }}></div>
                        </div>
                    </div>
                </Section>

                <ShareCharacter character={character} />
                <DiceRoller character={character} setCharacter={setCharacter} />
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Section title="As Cinco Chamas da Alma">
                    {isCreating && (
                        <div className={`text-center mb-4 p-2 rounded-md transition-colors ${pointsRemaining === 0 ? 'bg-green-800/50' : 'bg-amber-800/50'}`}>
                            Pontos para distribuir: <span className="font-bold text-lg">{pointsRemaining}</span>
                        </div>
                    )}
                    <div className="space-y-2">
                        {FLAME_KEYS.map(key => {
                            const isStrongFlame = activeArchetype.strongFlames.includes(key);
                            return (
                                <div key={key} className={`flex items-center space-x-4 p-2 rounded-lg border-2 transition-all duration-300 ${isStrongFlame ? 'border-amber-400/40 bg-slate-800' : 'border-transparent'}`}>
                                    <div className={`p-2 rounded-full bg-slate-700 ${FLAME_DETAILS[key].color}`}>
                                        {React.createElement(FLAME_DETAILS[key].icon)}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`font-bold text-lg ${isStrongFlame ? 'text-amber-300' : FLAME_DETAILS[key].color} ${isStrongFlame ? '[text-shadow:0_0_8px_var(--tw-shadow-color)] animate-glow' : ''}`}>{key}</h3>
                                        <p className="text-sm text-slate-400">{FLAME_DETAILS[key].description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {isCreating && <button onClick={() => handleFlameChange(key, -1)} className="bg-slate-600 h-7 w-7 rounded-full text-lg">-</button>}
                                        <span className="font-mono text-2xl w-8 text-center">{character.flames[key]}</span>
                                        {isCreating && <button onClick={() => handleFlameChange(key, 1)} className="bg-slate-600 h-7 w-7 rounded-full text-lg">+</button>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {isCreating && <button onClick={handleFinalizeCreation} className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500" disabled={pointsRemaining !== 0 || !character.name.trim()}>Finalizar Criação</button>}
                </Section>

                <Section title="Habilidades e Bônus">
                    <h3 className="font-bold text-amber-200">Habilidade Especial de Arquétipo</h3>
                    <p className="mb-3 text-slate-300">{activeArchetype.specialAbility}</p>
                    <h3 className="font-bold text-amber-200">Equipamento Inicial</h3>
                    <p className="mb-3 text-slate-300">{activeArchetype.equipmentDesc}</p>
                    {character.specialBonuses && character.specialBonuses.length > 0 && (
                        <>
                            <h3 className="font-bold text-amber-200">Bônus de Origem</h3>
                            <ul className="list-disc list-inside text-slate-300">
                                {character.specialBonuses.map((bonus, i) => <li key={i}>{bonus}</li>)}
                            </ul>
                        </>
                    )}
                </Section>

                <EquipmentAndInventory character={character} setCharacter={setCharacter} />
                <EcosSection character={character} setCharacter={setCharacter} />
            </div>

            <div className="lg:col-span-1 space-y-6">
                <ItemDatabaseSection setCharacter={setCharacter} />
                <Section title="Regras e Efeitos">
                    <h3 className="font-bold text-amber-200 mb-2">Efeitos da Penumbra</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {PENUMBRA_EFFECTS.map(effect => (
                            <li key={effect.range}><strong>{effect.range}:</strong> {effect.description}</li>
                        ))}
                    </ul>
                    <h3 className="font-bold text-amber-200 mt-4 mb-2">Dificuldades de Teste</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {DIFFICULTIES.map(d => <li key={d.name}>{d.name}: {d.value}</li>)}
                    </ul>
                </Section>

                <Section title="Níveis de Influência">
                    <div className="space-y-2">
                        {Object.entries(FACTIONS).map(([key, name]) => (
                            <div key={key} className="flex justify-between items-center">
                                <label className="text-slate-300">{String(name)}</label>
                                <input type="number" min="0" value={character.influence[key as keyof typeof FACTIONS]} onChange={e => setCharacter(c => ({ ...c, influence: { ...c.influence, [key]: Number(e.target.value) } }))} className="w-20 bg-slate-900/80 border border-slate-600 rounded-md p-1 text-center" />
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="História e Personalidade">
                    <TextArea value={character.history} onChange={e => updateCharacterField('history', e.target.value)} placeholder="História Pessoal..." />
                    <TextArea value={character.personality} onChange={e => updateCharacterField('personality', e.target.value)} placeholder="Personalidade..." />
                    <TextArea value={character.objectives} onChange={e => updateCharacterField('objectives', e.target.value)} placeholder="Objetivos..." />
                    <TextArea value={character.fears} onChange={e => updateCharacterField('fears', e.target.value)} placeholder="Medos/Fraquezas..." />
                </Section>

                <Section title="Segredo Sombrio">
                    <TextArea value={character.darkSecret} onChange={e => updateCharacterField('darkSecret', e.target.value)} placeholder="Algo que, se descoberto, aumenta sua Penumbra..." />
                </Section>

                <Section title="Anotações da Sessão">
                    <TextArea value={character.notes} onChange={e => updateCharacterField('notes', e.target.value)} placeholder="Itens, aliados, eventos importantes..." rows={5} />
                </Section>
            </div>
        </div>
    );
}