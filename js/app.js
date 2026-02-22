/**
 * Punto de entrada: pantallas, navegación y coordinación de módulos.
 */

import { renderLevel } from './drag-drop.js';
import {
  getCurrentLevel,
  getCurrentLevelNumber,
  getScore,
  resetGame,
  addCorrectMatch,
  goToNextLevel,
  onLevelComplete,
  getTotalLevels,
} from './game.js';
import { playSuccessSound, playErrorSound, playApplauseSound } from './audio.js';
import { speakStep, speakAllSteps, stopGuideAudio } from './guide.js';
import { showStarRain } from './star-rain.js';

const SCREENS = {
  welcome: 'screen-welcome',
  game: 'screen-game',
  result: 'screen-result',
};

const elements = {
  btnStart: null,
  btnNext: null,
  btnReplay: null,
  btnContinue: null,
  currentLevel: null,
  currentScore: null,
  resultTitle: null,
  resultMessage: null,
  resultScore: null,
};

function getElements() {
  if (!elements.btnStart) {
    elements.btnStart = document.getElementById('btn-start');
    elements.btnNext = document.getElementById('btn-next');
    elements.btnReplay = document.getElementById('btn-replay');
    elements.btnContinue = document.getElementById('btn-continue');
    elements.currentLevel = document.getElementById('current-level');
    elements.currentScore = document.getElementById('current-score');
    elements.resultTitle = document.getElementById('result-title');
    elements.resultMessage = document.getElementById('result-message');
    elements.resultScore = document.getElementById('result-score');
  }
  return elements;
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('screen--active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('screen--active');
}

function updateGameUI() {
  const el = getElements();
  if (el.currentLevel) el.currentLevel.textContent = getCurrentLevelNumber();
  if (el.currentScore) el.currentScore.textContent = getScore();
}

function startLevel() {
  const level = getCurrentLevel();
  updateGameUI();

  renderLevel(level, {
    onDrop(vocal, _zoneElement) {
      addCorrectMatch(vocal);
      playSuccessSound();
      updateGameUI();
    },
    onWrongDrop() {
      playErrorSound();
    },
  });

  const el = getElements();
  if (el.btnNext) el.btnNext.disabled = true;
}

function onLevelFinished(result) {
  const el = getElements();
  if (el.resultTitle) {
    el.resultTitle.textContent = result.isLastLevel ? '¡Has completado todos los niveles!' : '¡Nivel completado!';
  }
  if (el.resultMessage) {
    el.resultMessage.textContent = result.isLastLevel
      ? 'Muy bien, ya conoces las vocales.'
      : `Siguiente: nivel ${result.level + 1}.`;
  }
  if (el.resultScore) el.resultScore.textContent = result.score;

  if (el.btnContinue) {
    el.btnContinue.style.display = result.isLastLevel ? 'none' : '';
    el.btnContinue.disabled = false;
  }
  if (el.btnReplay) el.btnReplay.style.display = '';

  showScreen(SCREENS.result);
}

function openGuide() {
  const overlay = document.getElementById('guide-overlay');
  if (overlay) {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function closeGuide() {
  const overlay = document.getElementById('guide-overlay');
  if (overlay) {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  stopGuideAudio();
}

function bindGuide() {
  const btnGuide = document.getElementById('btn-guide');
  const overlay = document.getElementById('guide-overlay');
  const btnClose = document.getElementById('guide-close');
  const stepsContainer = document.getElementById('guide-steps');
  const btnPlayAll = document.getElementById('guide-play-all');
  const btnStop = document.getElementById('guide-stop');

  btnGuide?.addEventListener('click', openGuide);

  btnClose?.addEventListener('click', closeGuide);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeGuide();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('is-open')) closeGuide();
  });

  stepsContainer?.querySelectorAll('.guide-step__play').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.guide-step');
      const index = parseInt(step?.dataset.step ?? '0', 10);
      speakStep(index);
    });
  });

  btnPlayAll?.addEventListener('click', () => speakAllSteps());
  btnStop?.addEventListener('click', () => stopGuideAudio());
}

function bindEvents() {
  const el = getElements();

  bindGuide();

  el.btnStart?.addEventListener('click', () => {
    resetGame();
    showScreen(SCREENS.game);
    startLevel();
  });

  onLevelComplete((result) => {
    if (el.btnNext) el.btnNext.disabled = false;
    playApplauseSound();
    showStarRain(() => {
      onLevelFinished(result);
    });
  });

  el.btnNext?.addEventListener('click', () => {
    if (!goToNextLevel()) return;
    showScreen(SCREENS.game);
    startLevel();
  });

  el.btnReplay?.addEventListener('click', () => {
    resetGame();
    showScreen(SCREENS.game);
    startLevel();
  });

  el.btnContinue?.addEventListener('click', () => {
    if (!goToNextLevel()) return;
    showScreen(SCREENS.game);
    startLevel();
  });
}

function init() {
  bindEvents();
  showScreen(SCREENS.welcome);
}

init();
