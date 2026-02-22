/**
 * Guía interactiva con audio (Web Speech API).
 * Lee los pasos en español.
 */

const GUIDE_STEPS = [
  'Paso 1. Mira las imágenes que aparecen. Cada una tiene una palabra debajo.',
  'Paso 2. Arrastra cada vocal: A, E, I, O, U, hacia la imagen que comienza con esa letra.',
  'Paso 3. Cuando aciertes, escucharás un sonido y ganarás puntos.',
  'Paso 4. Completa todas las parejas para pasar al siguiente nivel. ¡Diviértete!',
];

let synthesis = null;
let currentUtterance = null;

function getSynthesis() {
  if (!synthesis && 'speechSynthesis' in window) {
    synthesis = window.speechSynthesis;
  }
  return synthesis;
}

/**
 * Reproduce un paso por voz (español).
 * @param {number} stepIndex - Índice del paso (0-based)
 * @param {() => void} [onEnd] - Callback al terminar de hablar
 */
export function speakStep(stepIndex, onEnd) {
  const syn = getSynthesis();
  if (!syn) {
    onEnd?.();
    return;
  }

  syn.cancel();

  const text = GUIDE_STEPS[stepIndex];
  if (!text) {
    onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  syn.speak(utterance);
}

/**
 * Reproduce todos los pasos seguidos.
 * @param {(stepIndex: number) => void} [onStepStart] - Se llama al iniciar cada paso
 * @param {() => void} [onComplete] - Se llama al terminar toda la guía
 */
export function speakAllSteps(onStepStart, onComplete) {
  const syn = getSynthesis();
  if (!syn) {
    onComplete?.();
    return;
  }

  syn.cancel();

  let index = 0;

  function speakNext() {
    if (index >= GUIDE_STEPS.length) {
      currentUtterance = null;
      onComplete?.();
      return;
    }

    onStepStart?.(index);
    const text = GUIDE_STEPS[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      index += 1;
      setTimeout(speakNext, 400);
    };

    utterance.onerror = () => {
      index += 1;
      setTimeout(speakNext, 400);
    };

    currentUtterance = utterance;
    syn.speak(utterance);
  }

  speakNext();
}

/**
 * Detiene el audio de la guía.
 */
export function stopGuideAudio() {
  const syn = getSynthesis();
  if (syn) {
    syn.cancel();
    currentUtterance = null;
  }
}

/**
 * Indica si hay audio reproduciéndose.
 * @returns {boolean}
 */
export function isSpeaking() {
  const syn = getSynthesis();
  return syn ? syn.speaking : false;
}

/**
 * Textos de los pasos (para accesibilidad o UI).
 * @returns {string[]}
 */
export function getGuideSteps() {
  return [...GUIDE_STEPS];
}
