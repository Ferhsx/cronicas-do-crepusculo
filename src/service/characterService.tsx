// src/services/characterService.ts

import { db } from '../firebase'; // Importa a instância do DB
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { Character } from '../types'; // Importe seu tipo Character

/**
 * Salva uma ficha de personagem no Firestore e retorna o ID único.
 * @param character Os dados da ficha a serem salvos.
 * @returns O ID do documento criado no Firestore.
 */
export const saveCharacterForSharing = async (character: Character): Promise<string> => {
    try {
        // A função addDoc adiciona um novo documento com um ID gerado automaticamente.
        const docRef = await addDoc(collection(db, "sharedCharacters"), character);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao salvar a ficha no Firestore:", error);
        // Lança o erro para que o componente que chamou possa tratá-lo.
        throw new Error("Não foi possível salvar a ficha para compartilhamento.");
    }
};

/**
 * Busca uma ficha de personagem compartilhada do Firestore usando seu ID.
 * @param id O ID da ficha compartilhada.
 * @returns Os dados da ficha ou null se não for encontrada.
 */
export const getSharedCharacter = async (id: string): Promise<Character | null> => {
    try {
        const docRef = doc(db, "sharedCharacters", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Retorna os dados do documento, convertidos para o tipo Character.
            return docSnap.data() as Character;
        } else {
            console.warn(`Nenhuma ficha encontrada com o ID: ${id}`);
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar a ficha no Firestore:", error);
        throw new Error("Não foi possível buscar a ficha compartilhada.");
    }
};