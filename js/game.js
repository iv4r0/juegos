/**
 * Lógica del juego: niveles, puntuación y estado.
 */

import { LEVELS, POINTS_PER_CORRECT, TOTAL_LEVELS } from './constants.js';

/** @type {number} */
let currentLevelIndex = 0;

/** @type {number} */
let score = 0;

/** @type {((result: { level: number, score: number, isLastLevel: boolean }) => void) | null} */
let onLevelCompleteCallback = null;

/** Número de parejas acertadas en el nivel actual */
let matchedInLevel = 0;

/**
 * Reinicia el juego al nivel 1 y puntuación 0.
 */
export function resetGame() {
  currentLevelIndex = 0;
  score = 0;
  matchedInLevel = 0;
}

/**
 * Obtiene el nivel actual.
 * @returns {typeof LEVELS[0]}
 */
export function getCurrentLevel() {
  return LEVELS[currentLevelIndex];
}

/**
 * Obtiene el índice del nivel actual (1-based para UI).
 * @returns {number}
 */
export function getCurrentLevelNumber() {
  return currentLevelIndex + 1;
}

/**
 * Obtiene la puntuación actual.
 * @returns {number}
 */
export function getScore() {
  return score;
}

/**
 * Suma puntos por un acierto y comprueba si el nivel está completo.
 * @param {string} vocal - Vocal acertada
 * @returns {{ levelComplete: boolean, isLastLevel: boolean }}
 */
export function addCorrectMatch(vocal) {
  score += POINTS_PER_CORRECT;
  matchedInLevel += 1;
  const level = getCurrentLevel();
  const totalPairs = level.pairs.length;
  const levelComplete = matchedInLevel >= totalPairs;

  if (levelComplete) {
    notifyLevelComplete();
  }

  return {
    levelComplete,
    isLastLevel: currentLevelIndex >= TOTAL_LEVELS - 1,
  };
}

/**
 * Avanza al siguiente nivel (reinicia contador de parejas del nivel).
 * @returns {boolean} true si hay siguiente nivel, false si se acabaron
 */
export function goToNextLevel() {
  matchedInLevel = 0;
  if (currentLevelIndex < TOTAL_LEVELS - 1) {
    currentLevelIndex += 1;
    return true;
  }
  return false;
}

/**
 * Registra callback cuando se completa un nivel (todas las vocales emparejadas).
 * @param {(result: { level: number, score: number, isLastLevel: boolean }) => void} fn
 */
export function onLevelComplete(fn) {
  onLevelCompleteCallback = fn;
}

/**
 * Notifica que el nivel se completó (todas las parejas correctas).
 */
export function notifyLevelComplete() {
  if (onLevelCompleteCallback) {
    onLevelCompleteCallback({
      level: getCurrentLevelNumber(),
      score: getScore(),
      isLastLevel: currentLevelIndex >= TOTAL_LEVELS - 1,
    });
  }
}

/**
 * Número total de niveles.
 * @returns {number}
 */
export function getTotalLevels() {
  return TOTAL_LEVELS;
}
