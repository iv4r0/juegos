/**
 * Punto de entrada: juego Completar palabras con vocales.
 * Palabras al azar, imagen + palabra sin vocales + vocales para arrastrar.
 */

import { WORDS, shuffle } from './completar-constants.js';
import { renderWord } from './completar-drag.js';

let currentWords = [];
let currentIndex = 0;
let score = 0;
let currentRenderer = null;

const SCREENS = { welcome: 'screen-welcome', game: 'screen-game', result: 'screen-result' };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('screen--active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('screen--active');
}

function getEl(id) {
  return document.getElementById(id);
}

function startGame() {
  currentWords = shuffle(WORDS);
  currentIndex = 0;
  score = 0;
  showScreen(SCREENS.game);
  loadWord();
}

function loadWord() {
  const item = currentWords[currentIndex];
  if (!item) {
    showResult();
    return;
  }

  const emojiEl = getEl('word-emoji');
  if (emojiEl) emojiEl.textContent = item.emoji;

  const indexEl = getEl('current-index');
  const totalEl = getEl('total-words');
  if (indexEl) indexEl.textContent = currentIndex + 1;
  if (totalEl) totalEl.textContent = currentWords.length;

  const scoreEl = getEl('current-score');
  if (scoreEl) scoreEl.textContent = score;

  const btnCheck = getEl('btn-check');
  const btnNext = getEl('btn-next');
  if (btnCheck) {
    btnCheck.disabled = true;
    btnCheck.style.display = '';
  }
  if (btnNext) btnNext.style.display = 'none';

  currentRenderer = renderWord(item, {
    onAllFilled() {
      if (btnCheck) btnCheck.disabled = false;
    },
    onCheck() {
      if (btnCheck) btnCheck.style.display = 'none';
      if (btnNext) btnNext.style.display = '';
    },
  });
}

// Import dinámico para sonido (evitar error si no existe)
async function playFeedback(correct) {
  try {
    const { playSuccessSound, playErrorSound } = await import('./audio.js');
    if (correct) playSuccessSound();
    else playErrorSound();
  } catch (_) {}
}

function onCheckClick() {
  if (!currentRenderer) return;
  const correct = currentRenderer.checkAnswer();
  playFeedback(correct);
  if (correct) score += 10;
  const scoreEl = getEl('current-score');
  if (scoreEl) scoreEl.textContent = score;
  getEl('btn-check').style.display = 'none';
  getEl('btn-next').style.display = '';
}

function onNextClick() {
  currentIndex += 1;
  if (currentIndex >= currentWords.length) {
    showResult();
    return;
  }
  loadWord();
}

function showResult() {
  const scoreEl = getEl('result-score');
  if (scoreEl) scoreEl.textContent = score;
  showScreen(SCREENS.result);
}

function bindEvents() {
  getEl('btn-start')?.addEventListener('click', startGame);
  getEl('btn-check')?.addEventListener('click', onCheckClick);
  getEl('btn-next')?.addEventListener('click', onNextClick);
  getEl('btn-replay')?.addEventListener('click', startGame);
}

function init() {
  bindEvents();
  showScreen(SCREENS.welcome);
}

init();
