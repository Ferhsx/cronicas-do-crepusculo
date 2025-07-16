
import { Archetype, Origin, Flame, Difficulty, Item, Weapon, Armor } from './types';

export const ITEMS: Record<string, Weapon | Armor | Item> = {
    // Armas
    'espada_crepusculo': { id: 'espada_crepusculo', name: 'Espada do Crepúsculo', description: 'Uma lâmina que parece absorver a luz.', damageBonus: 1 },
    'lamina_vidro_negro': { id: 'lamina_vidro_negro', name: 'Lâmina de Vidro Negro', description: '+2 dano, pode cortar através de sombras.', damageBonus: 2 },
    'arco_osso_dragao': { id: 'arco_osso_dragao', name: 'Arco de Osso de Dragão', description: '+3 dano à distância, flechas de gelo.', damageBonus: 3 },
    'martelo_ecos': { id: 'martelo_ecos', name: 'Martelo dos Ecos', description: '+2 dano, pode quebrar magias.', damageBonus: 2 },
    'adagas_vidro_negro': { id: 'adagas_vidro_negro', name: 'Adagas de Vidro Negro', description: 'Leves e mortais, perfeitas para um assassino.', damageBonus: 1 },

    // Armaduras
    'armadura_crepusculo': { id: 'armadura_crepusculo', name: 'Armadura do Crepúsculo', description: 'Muda de cor conforme a luz.', defenseBonus: 1 },
    'cota_malha_lunar': { id: 'cota_malha_lunar', name: 'Cota de Malha Lunar', description: '+2 defesa, reflete ataques mágicos.', defenseBonus: 2 },
    'armadura_escamas': { id: 'armadura_escamas', name: 'Armadura de Escamas', description: '+3 defesa, -1 Prata, imune a frio.', defenseBonus: 3 },
    'manto_brumas': { id: 'manto_brumas', name: 'Manto de Brumas', description: '+1 defesa, +2 em furtividade.', defenseBonus: 1 },
    
    // Equipamento Inicial de Arquétipos
    'cristal_fragmentado': { id: 'cristal_fragmentado', name: 'Cristal Fragmentado', description: 'Mostra fragmentos do passado.'},
    'balanca_sentimentos': { id: 'balanca_sentimentos', name: 'Balança de Sentimentos', description: 'Pesa memórias e emoções em forma de moedas de lágrimas cristalizadas.'},
    'cajado_gelo': { id: 'cajado_gelo', name: 'Cajado de Gelo Eterno', description: 'Um cajado de gelo que nunca derrete.', damageBonus: 1},
};


export const ARCHETYPES: Archetype[] = [
  {
    id: 'cavaleiro',
    name: 'Cavaleiro do Crepúsculo',
    concept: 'Guerreiro que fez pacto com a própria escuridão.',
    strongFlames: [Flame.Ferro, Flame.Jade],
    specialAbility: 'Pode sacrificar Penumbra para dar dano extra (1 Penumbra = +1d6 dano).',
    equipmentDesc: 'Armadura que muda de cor conforme a luz, espada que corta sombras.',
    startingEquipment: ['espada_crepusculo', 'armadura_crepusculo'],
  },
  {
    id: 'lamina',
    name: 'Lâmina Lunar',
    concept: 'Assassino que usa a luz perpétua como camuflagem.',
    strongFlames: [Flame.Prata, Flame.Rubi],
    specialAbility: 'Invisibilidade parcial gastando 1 Penumbra por turno.',
    equipmentDesc: 'Adagas de vidro negro, corda de cabelo de sereia.',
    startingEquipment: ['adagas_vidro_negro', 'manto_brumas'],
  },
  {
    id: 'oraculo',
    name: 'Oráculo Cinzento',
    concept: 'Vidente que enxerga através do tempo parado.',
    strongFlames: [Flame.Ouro, Flame.Rubi],
    specialAbility: 'Uma vez por sessão, pode refazer qualquer rolagem (sua ou de aliado).',
    equipmentDesc: 'Cristal que mostra fragmentos do passado, pergaminhos em branco que se escrevem sozinhos.',
    startingEquipment: ['cristal_fragmentado'],
  },
  {
    id: 'mercador',
    name: 'Mercador de Almas',
    concept: 'Negociante que comercializa com memórias e emoções.',
    strongFlames: [Flame.Jade, Flame.Ouro],
    specialAbility: 'Pode "emprestar" pontos de Chama para aliados (máximo 2 pontos por sessão).',
    equipmentDesc: 'Balança que pesa sentimentos, moedas feitas de lágrimas cristalizadas.',
    startingEquipment: ['balanca_sentimentos'],
  },
  {
    id: 'druida',
    name: 'Druida do Gelo Eterno',
    concept: 'Guardião da natureza congelada no tempo.',
    strongFlames: [Flame.Ferro, Flame.Rubi],
    specialAbility: 'Pode congelar temporariamente inimigos (gastando 2 Penumbra).',
    equipmentDesc: 'Cajado de gelo que nunca derrete, sementes que crescem em plantas de cristal.',
    startingEquipment: ['cajado_gelo', 'manto_brumas'],
  },
];

export const ORIGINS: Origin[] = [
  {
    id: 'nobre',
    name: 'Nobre Decaído',
    benefit: '+1 Jade, +1 Influência em qualquer facção.',
  },
  {
    id: 'sobrevivente',
    name: 'Sobrevivente das Ruas',
    benefit: '+1 Prata, +1 Penumbra inicial.',
  },
  {
    id: 'estudioso',
    name: 'Estudioso Exilado',
    benefit: '+1 Ouro, conhece 1 Eco extra.',
  },
  {
    id: 'artesao',
    name: 'Artesão Mágico',
    benefit: '+1 Ferro, equipamento inicial é mágico.',
  },
];

export const INITIAL_POINTS_TO_DISTRIBUTE = 10;
export const MIN_FLAME_START = 1;
export const MAX_FLAME_START = 4;
export const MAX_PENUMBRA = 10;
export const BASE_HP = 20;

export const DIFFICULTIES: Difficulty[] = [
    { name: 'Trivial', value: 8 },
    { name: 'Moderado', value: 10 },
    { name: 'Difícil', value: 12 },
    { name: 'Heroico', value: 14 },
    { name: 'Lendário', value: 16 },
];

export const PENUMBRA_EFFECTS = [
    { range: '0-3', description: 'Normal' },
    { range: '4-6', description: '-1 em todos os testes, mas +1 em testes de Rubi' },
    { range: '7-9', description: '-2 em testes, mas +2 em Rubi e pode usar habilidades sombrias' },
    { range: '10', description: 'Perdido na Escuridão - vira NPC do mestre' },
];

export const FACTIONS = {
    crepuscular: 'Guarda Crepuscular',
    eterna: 'Culto da Luz Eterna',
    brumas: 'Mercadores das Brumas',
    alvorecer: 'Rebeldes do Alvorecer',
};
