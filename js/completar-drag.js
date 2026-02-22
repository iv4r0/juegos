/**
 * Renderiza la palabra con huecos y las vocales arrastrables.
 * Drag and drop: arrastrar vocal a cada hueco.
 */

import { getWordParts, getWordVowels, shuffle } from './completar-constants.js';

/**
 * @param {{ word: string, emoji: string }} item
 * @param {Object} callbacks
 * @param {(filled: boolean) => void} [callbacks.onAllFilled] - Se llama cuando todos los huecos tienen una vocal
 * @param {(correct: boolean) => void} [callbacks.onCheck] - Se llama al comprobar (correct = todas bien)
 */
export function renderWord(item, callbacks = {}) {
  const slotsEl = document.getElementById('word-slots');
  const vocalsEl = document.getElementById('drag-vocals');

  if (!slotsEl || !vocalsEl) return;

  slotsEl.innerHTML = '';
  vocalsEl.innerHTML = '';

  const parts = getWordParts(item.word);
  const vowels = shuffle(getWordVowels(item.word));

  const slotElements = [];
  parts.forEach((part, index) => {
    if (part.type === 'letter') {
      const span = document.createElement('span');
      span.className = 'word-letter';
      span.textContent = part.char;
      slotsEl.appendChild(span);
    } else {
      const slot = document.createElement('div');
      slot.className = 'word-slot';
      slot.dataset.expected = part.expected;
      slot.dataset.index = String(slotElements.length);
      slot.setAttribute('role', 'region');
      slot.setAttribute('aria-label', `Hueco para vocal ${part.expected}`);
      slotElements.push(slot);
      slotsEl.appendChild(slot);
    }
  });

  const dragItems = [];
  vowels.forEach((v) => {
    const div = document.createElement('div');
    div.className = 'drag-vocal';
    div.dataset.vocal = v;
    div.setAttribute('draggable', 'true');
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', `Arrastra la vocal ${v}`);
    div.textContent = v;
    dragItems.push(div);
    vocalsEl.appendChild(div);
  });

  let filledCount = 0;

  function isAllFilled() {
    return slotElements.every((s) => s.dataset.filled === 'true');
  }

  function updateFilledState() {
    filledCount = slotElements.filter((s) => s.dataset.filled === 'true').length;
    if (isAllFilled()) callbacks.onAllFilled?.(true);
  }

  slotElements.forEach((slot) => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!slot.dataset.filled) slot.classList.add('word-slot--over');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('word-slot--over'));
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('word-slot--over');
      if (slot.dataset.filled) return;

      const vocal = e.dataTransfer.getData('text/plain');
      const source = dragItems.find((d) => d.dataset.vocal === vocal && !d.classList.contains('drag-vocal--used'));
      if (!source) return;

      slot.textContent = vocal;
      slot.dataset.filled = 'true';
      slot.dataset.dropped = vocal;
      source.classList.add('drag-vocal--used');
      updateFilledState();
    });
  });

  dragItems.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      if (item.classList.contains('drag-vocal--used')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', item.dataset.vocal);
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('drag-vocal--dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('drag-vocal--dragging');
      document.querySelectorAll('.word-slot--over').forEach((s) => s.classList.remove('word-slot--over'));
    });
  });

  return {
    getSlotElements: () => slotElements,
    checkAnswer() {
      const allCorrect = slotElements.every((s) => s.dataset.dropped === s.dataset.expected);
      slotElements.forEach((s) => {
        if (s.dataset.dropped === s.dataset.expected) {
          s.classList.add('word-slot--filled');
        } else {
          s.classList.add('word-slot--wrong');
        }
      });
      callbacks.onCheck?.(allCorrect);
      return allCorrect;
    },
  };
}
