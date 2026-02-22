# Instrucciones para agentes (Copilot / assistants)

Propósito: permitir que un agente de código sea productivo rápidamente en este repositorio estático de juegos educativos (HTML + ES modules).

**Visión general**
- **Arquitectura**: colección de páginas HTML estáticas que cargan módulos ES desde `js/`. No hay bundler ni servidor por defecto; los módulos son imports relativos (p. ej. `import { renderLevel } from './drag-drop.js'`).
- **Entradas / pantallas**: `js/app.js` es el entry para la app principal (navegación pantalla/partidas). `js/completar-app.js` es el entry para la variante "Completar palabras".
- **Lógica del juego**: `js/game.js` mantiene estado (niveles, puntuación) y expone callbacks como `onLevelComplete(fn)` y funciones como `addCorrectMatch()` y `goToNextLevel()`.

**Archivos clave (ejemplos concretos)**
- `js/app.js`: coordina pantallas, llama `renderLevel(level, { onDrop, onWrongDrop })` y usa `showStarRain()` después de `onLevelComplete`.
- `js/game.js`: contiene `LEVELS` usage vía `constants.js`, exporta estado y callbacks.
- `js/completar-app.js`: carga palabras desde `completar-constants.js`, usa `renderWord(item, { onAllFilled, onCheck })` y hace `import('./audio.js')` dinámico para evitar errores si falta el módulo.
- `js/completar-drag.js` / `js/drag-drop.js`: contienen lo relacionado con la UI drag & drop y renderers que devuelven un objeto controlador (p. ej. método `checkAnswer()`).

**Patrones y convenciones específicas del proyecto**
- Módulos ES nativos con imports relativos; no añadir código que requiera bundling sin actualizar el README.
- Las pantallas se controlan por IDs y la clase `screen--active`. IDs esperados: `btn-start`, `btn-next`, `btn-replay`, `current-level`, `current-score`, `result-title`, etc.
- Los renderers de UI devuelven un objeto con métodos y callbacks (ej.: `renderWord(...)` o `renderLevel(...)`). Trátalos como controladores (no alterar su API pública).
- Uso de lazy-getter para elementos DOM: `getElements()` en `js/app.js` — evita duplicar referencias DOM y respeta ese patrón.
- Sonidos son opcionales: algunos módulos usan `import('./audio.js')` dinámico; manejar fallos silenciosos como se hace hoy.

**Flujo típico para cambios comunes**
- Añadir/editar un nivel: actualizar `js/constants.js` o `js/completar-constants.js` (ver formato `LEVELS` / `WORDS`) y probar en navegador.
- Añadir un nuevo renderer de UI: exportar una función que monte DOM y devuelva un controller con callbacks y un método `destroy()` o `checkAnswer()` si aplica.

**Desarrollo / ejecución**
- No hay build: abrir `index.html` o `completar-palabras.html` en un navegador con soporte de módulos (o usar un servidor estático). Ejemplos:

  - Servir desde el directorio del repo:

    ```powershell
    cd c:\IA
    python -m http.server 8000
    ```

  - O usar la extensión Live Server de VS Code.

- Depuración: usar DevTools (Sources / Breakpoints). Añadir `console.log` en entradas como `js/app.js`, `js/game.js` o en renderers.

**Integraciones y dependencias externas**
- Dependencias externas: ninguna declarada (no `package.json`). El proyecto es autónomo.
- Integración entre módulos: basada en imports y callbacks. Evitar acoplar módulos por selectores globales inesperados; prefiera la API exportada.

**Qué buscar al revisar PRs**
- Cambios que rompan imports relativos (rutas incorrectas). Verificar que los archivos referenciados existan.
- Alteraciones a IDs de DOM o clases CSS que no actualicen los callers (`getElementById`, `querySelectorAll`).
- Añadir código que requiera bundler o polyfills sin instrucción explícita.

Si alguna sección no está clara o faltan ejemplos concretos (p. ej. estructura exacta de `LEVELS` o `WORDS`), dime qué parte quieres que amplíe y añado ejemplos de código mínimo.
