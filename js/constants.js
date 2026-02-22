/**
 * Constantes y datos del juego de vocales.
 * 5 palabras (una por vocal) con su imagen. Cada palabra empieza por su vocal.
 */

export const VOCALS = ['A', 'E', 'I', 'O', 'U'];

/** Niveles: cada uno tiene 5 parejas (una palabra por vocal). Cada palabra empieza por su vocal. */
export const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1',
    pairs: [
      { vocal: 'A', emoji: '🕷️', word: 'Araña' },
      { vocal: 'E', emoji: '🐘', word: 'Elefante' },
      { vocal: 'I', emoji: '🦎', word: 'Iguana' },
      { vocal: 'O', emoji: '🐻', word: 'Oso' },
      { vocal: 'U', emoji: '🍇', word: 'Uvas' },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2',
    pairs: [
      { vocal: 'A', emoji: '✈️', word: 'Avión' },
      { vocal: 'E', emoji: '⭐', word: 'Estrella' },
      { vocal: 'I', emoji: '🏝️', word: 'Isla' },
      { vocal: 'O', emoji: '🐑', word: 'Oveja' },
      { vocal: 'U', emoji: '🦄', word: 'Unicornio' },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3',
    pairs: [
      { vocal: 'A', emoji: '🌳', word: 'Árbol' },
      { vocal: 'E', emoji: '🦔', word: 'Erizo' },
      { vocal: 'I', emoji: '🧲', word: 'Imán' },
      { vocal: 'O', emoji: '👂', word: 'Oreja' },
      { vocal: 'U', emoji: '🌌', word: 'Universo' },
    ],
  },
];

/** Puntos por acierto */
export const POINTS_PER_CORRECT = 10;

/** Número de niveles */
export const TOTAL_LEVELS = LEVELS.length;
