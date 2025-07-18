
export enum Flame {
  Ferro = "Chama de Ferro",
  Prata = "Chama de Prata",
  Ouro = "Chama de Ouro",
  Jade = "Chama de Jade",
  Rubi = "Chama de Rubi",
}

export const FLAME_KEYS = [Flame.Ferro, Flame.Prata, Flame.Ouro, Flame.Jade, Flame.Rubi];

export interface Item {
  id: string;
  name: string;
  description: string;
  isMagical?: boolean;
}

export interface Weapon extends Item {
  damageBonus: number;
}

export interface Armor extends Item {
  defenseBonus: number;
}

export type EquipmentItem = Weapon | Armor | Item;

export function isWeapon(item: EquipmentItem): item is Weapon {
    return 'damageBonus' in item;
}

export function isArmor(item: EquipmentItem): item is Armor {
    return 'defenseBonus' in item;
}


export interface Archetype {
  id: string;
  name: string;
  concept: string;
  strongFlames: Flame[];
  specialAbility: string;
  equipmentDesc: string;
  startingEquipment: string[]; // item IDs
}

export interface Origin {
  id: string;
  name: string;
  benefit: string;
}

export interface Eco {
  id: string;
  name: string;
  description: string;
  cost?: string;
  isCustom?: boolean;
}

export interface Character {
  name: string;
  player: string;
  archetypeId: string;
  originId: string;
  flames: Record<Flame, number>;
  penumbra: number;
  hp: number;
  darkSecret: string;
  history: string;
  personality: string;
  objectives: string;
  fears: string;
  notes: string;
  influence: {
    crepuscular: number;
    eterna: number;
    brumas: number;
    alvorecer: number;
  };
  inventory: EquipmentItem[];
  equipped: {
      weapon: Weapon | null;
      armor: Armor | null;
  };
  ecos: Eco[];
  specialBonuses?: string[];
  imageUrl?: string;
}

export interface Difficulty {
    name: string;
    value: number;
}

export interface RollResult {
    type: 'Teste' | 'Ataque' | 'Defesa' | 'Iniciativa';
    rolls: number[];
    diceCount: number;
    flameType?: Flame;
    flameValue?: number;
    bonus?: number;
    bonusSource?: string;
    penumbraModifier?: number;
    difficulty?: number;
    total: number;
    success?: boolean;
    crepuscularRoll?: number;
    crepuscularEffect?: string;
    crepuscularDamageRoll?: number;
}