/**
 * Drag and drop: arrastrar vocales a las zonas de imagen.
 */

/**
 * Crea el DOM de una zona de soltar (imagen + palabra).
 * @param {{ vocal: string, emoji: string, word: string }} pair
 * @param {number} index
 * @returns {HTMLElement}
 */
function createDropZoneElement(pair, index) {
  const zone = document.createElement('div');
  zone.className = 'drop-zone';
  zone.dataset.vocal = pair.vocal;
  zone.dataset.index = String(index);
  zone.setAttribute('role', 'region');
  zone.setAttribute('aria-label', `Suelta la vocal para ${pair.word}`);

  zone.innerHTML = `
    <span class="drop-zone__emoji" aria-hidden="true">${pair.emoji}</span>
    <span class="drop-zone__word">${pair.word}</span>
  `;

  return zone;
}

/**
 * Crea el DOM de una vocal arrastrable.
 * @param {string} vocal
 * @returns {HTMLElement}
 */
function createDragItemElement(vocal) {
  const item = document.createElement('div');
  item.className = 'drag-item';
  item.dataset.vocal = vocal;
  item.setAttribute('draggable', 'true');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Arrastra la vocal ${vocal}`);
  item.textContent = vocal;

  return item;
}

/**
 * Inicializa el juego en el DOM: pinta zonas y vocales.
 * @param {{ pairs: Array<{ vocal: string, emoji: string, word: string }> }} level
 * @param {Object} callbacks
 * @param {(vocal: string, zoneElement: HTMLElement) => void} callbacks.onDrop
 * @param {() => void} [callbacks.onWrongDrop] - Se llama cuando sueltan en zona incorrecta
 */
export function renderLevel(level, callbacks) {
  const dropZonesContainer = document.getElementById('drop-zones');
  const dragItemsContainer = document.getElementById('drag-items');

  if (!dropZonesContainer || !dragItemsContainer) return;

  dropZonesContainer.innerHTML = '';
  dragItemsContainer.innerHTML = '';

  const pairs = level.pairs;

  pairs.forEach((pair, index) => {
    const zone = createDropZoneElement(pair, index);
    dropZonesContainer.appendChild(zone);
  });

  // 5 vocales arrastrables: A, E, I, O, U (una de cada)
  const vocalsToShow = [...new Set(pairs.map((p) => p.vocal))];
  vocalsToShow.forEach((vocal) => {
    const item = createDragItemElement(vocal);
    dragItemsContainer.appendChild(item);
  });

  setupDragAndDrop(dropZonesContainer, dragItemsContainer, callbacks);
}

/**
 * Configura eventos de arrastrar y soltar.
 * @param {HTMLElement} dropZonesContainer
 * @param {HTMLElement} dragItemsContainer
 * @param {{ onDrop: (vocal: string, zoneElement: HTMLElement) => void }} callbacks
 */
function setupDragAndDrop(dropZonesContainer, dragItemsContainer, callbacks) {
  const zones = dropZonesContainer.querySelectorAll('.drop-zone');
  const items = dragItemsContainer.querySelectorAll('.drag-item');

  let draggedItem = null;

  items.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      e.dataTransfer.setData('text/plain', item.dataset.vocal);
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('drag-item--dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('drag-item--dragging');
      zones.forEach((z) => z.classList.remove('drop-zone--over'));
      draggedItem = null;
    });
  });

  zones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!zone.classList.contains('drop-zone--correct')) {
        zone.classList.add('drop-zone--over');
      }
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drop-zone--over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drop-zone--over');

      if (!draggedItem) return;
      if (zone.classList.contains('drop-zone--correct')) return;

      const vocal = e.dataTransfer.getData('text/plain');
      const expectedVocal = zone.dataset.vocal;

      if (vocal === expectedVocal) {
        zone.classList.add('drop-zone--correct', 'drop-zone--correct-bounce');
        draggedItem.classList.add('drag-item--used', 'drag-item--correct-pop');
        callbacks.onDrop(vocal, zone);
        setTimeout(() => {
          zone.classList.remove('drop-zone--correct-bounce');
          draggedItem.classList.remove('drag-item--correct-pop');
        }, 600);
      } else {
        zone.classList.add('drop-zone--wrong');
        draggedItem.classList.add('drag-item--wrong');
        setTimeout(() => {
          zone.classList.remove('drop-zone--wrong');
          draggedItem.classList.remove('drag-item--wrong');
        }, 550);
        callbacks.onWrongDrop?.();
      }

      draggedItem = null;
    });
  });
}
