/**
 * Módulo de audio para feedback sonoro (niños 4-5 años).
 * Aciertos, desaciertos y aplausos al completar nivel.
 */

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Sonido de acierto: melodía corta y alegre (agradable para niños).
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.connect(gainNode);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const start = ctx.currentTime + i * 0.12;
      osc.start(start);
      osc.stop(start + 0.2);
    });

    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio no disponible:', e);
  }
}

/**
 * Sonido de desacierto: suave y amigable ("intenta de nuevo"), no punitivo.
 */
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(330, ctx.currentTime);
    oscillator.frequency.setValueAtTime(280, ctx.currentTime + 0.15);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio no disponible:', e);
  }
}

/**
 * Sonido de aplausos al completar nivel (palmadas simuladas con ruido).
 */
export function playApplauseSound() {
  try {
    const ctx = getAudioContext();
    const sampleRate = ctx.sampleRate;
    const numClaps = 14;

    for (let c = 0; c < numClaps; c++) {
      const burstLen = Math.floor(sampleRate * 0.05);
      const burst = ctx.createBuffer(1, burstLen, sampleRate);
      const burstData = burst.getChannelData(0);
      for (let i = 0; i < burstLen; i++) {
        burstData[i] = (Math.random() * 2 - 1) * (1 - i / burstLen);
      }
      const source = ctx.createBufferSource();
      source.buffer = burst;
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + c * 0.12 + Math.random() * 0.06;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(startTime);
      source.stop(startTime + 0.06);
    }
  } catch (e) {
    console.warn('Audio no disponible:', e);
  }
}
