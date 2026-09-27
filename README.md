# The Log Pose OPfans

Página web fan/no oficial de logros de One Piece.

## Estructura

- `index.html` — página principal.
- `styles.css` — diseño.
- `script.js` — filtros, palabras clave y guardado del progreso.
- `assets/achievements.json` — lista editable de logros.
- `assets/images/` — colocar aquí las imágenes de cada logro.
- `assets/icons/logo.svg` — logo incluido.

## Para agregar imágenes

Usá exactamente estos nombres para los ejemplos incluidos:

- `east-blue.png`
- `orange-town.png`
- `baratie.png`
- `katana.png`
- `frutas.png`
- `ohara.png`

Si una imagen todavía no existe, la página muestra automáticamente `placeholder.svg`, por lo que nunca queda una imagen rota.

## Para cambiar una palabra clave

Abrí `assets/achievements.json` y modificá el campo `keyword`.

Ejemplo:
`"keyword": "EASTBLUE"`

La palabra se compara sin distinguir mayúsculas/minúsculas.

## Publicar en GitHub Pages

1. Subí todo el contenido de este ZIP a tu repositorio.
2. En GitHub: Settings → Pages.
3. En Source elegí `Deploy from a branch`.
4. Seleccioná la rama donde subiste los archivos y la carpeta `/ (root)`.
5. Guardá y esperá a que GitHub genere la página.

## Nota

El progreso se guarda en `localStorage`, por lo que cada navegador/dispositivo mantiene su propio progreso. Para un sistema con cuentas, progreso compartido o administración desde una base de datos habría que agregar un backend.
