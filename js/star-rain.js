/**
 * Lluvia de estrellas al completar cada nivel (niños 4-5 años).
 */

const STAR_CHARS = ['⭐', '🌟', '✨'];
const STAR_COUNT = 35;
const DURATION_MS = 2800;

/**
 * Muestra la lluvia de estrellas durante un tiempo y luego la oculta.
 * @param {() => void} [onComplete] - Se llama al terminar la animación
 */
export function showStarRain(onComplete) {
  const container = document.getElementById('star-rain');
  if (!container) {
    onComplete?.();
    return;
  }

  container.innerHTML = '';
  container.classList.add('is-active');
  container.setAttribute('aria-hidden', 'false');

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('span');
    star.className = 'star-rain__star';
    star.textContent = STAR_CHARS[i % STAR_CHARS.length];
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
    star.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(star);
  }

  setTimeout(() => {
    container.classList.remove('is-active');
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = '';
    onComplete?.();
  }, DURATION_MS);
}
