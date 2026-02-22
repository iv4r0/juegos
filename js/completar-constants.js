/**
 * Palabras con imagen para el juego "Completar con vocales".
 * Todas contienen vocales. Se muestran al azar.
 */

export const WORDS = [
  { word: 'ELEFANTE', emoji: '🐘' },
  { word: 'OSO', emoji: '🐻' },
  { word: 'UVA', emoji: '🍇' },
  { word: 'AVION', emoji: '✈️' },
  { word: 'CASA', emoji: '🏠' },
  { word: 'SOL', emoji: '☀️' },
  { word: 'LUNA', emoji: '🌙' },
  { word: 'PELOTA', emoji: '⚽' },
  { word: 'MANZANA', emoji: '🍎' },
  { word: 'IGUANA', emoji: '🦎' },
  { word: 'OVEJA', emoji: '🐑' },
  { word: 'UNICORNIO', emoji: '🦄' },
  { word: 'ARBOL', emoji: '🌳' },
  { word: 'AGUA', emoji: '💧' },
  { word: 'ESTRELLA', emoji: '⭐' },
];

const VOCALS = 'AEIOUÁÉÍÓÚ';

/** Normaliza vocal con tilde a sin tilde (A, E, I, O, U) */
export function normalizeVocal(char) {
  const upper = char.toUpperCase();
  if (upper === 'Á') return 'A';
  if (upper === 'É') return 'E';
  if (upper === 'Í') return 'I';
  if (upper === 'Ó') return 'O';
  if (upper === 'Ú') return 'U';
  return upper;
}

/** Indica si un carácter es vocal (incluye tildes) */
export function isVocal(char) {
  return VOCALS.includes(char.toUpperCase());
}

/**
 * Descompone una palabra en partes: letra fija o hueco (vocal).
 * @param {string} word - Palabra en mayúsculas
 * @returns {{ type: 'letter'|'vocal', char?: string, expected?: string }[]}
 */
export function getWordParts(word) {
  const parts = [];
  const w = word.toUpperCase();
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    if (isVocal(c)) {
      parts.push({ type: 'vocal', expected: normalizeVocal(c) });
    } else {
      parts.push({ type: 'letter', char: c });
    }
  }
  return parts;
}

/**
 * Devuelve la lista de vocales que tiene la palabra (en orden, para los huecos).
 * @param {string} word
 * @returns {string[]}
 */
export function getWordVowels(word) {
  const w = word.toUpperCase();
  const vowels = [];
  for (let i = 0; i < w.length; i++) {
    if (isVocal(w[i])) vowels.push(normalizeVocal(w[i]));
  }
  return vowels;
}

/** Mezcla un array (Fisher-Yates) */
export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
