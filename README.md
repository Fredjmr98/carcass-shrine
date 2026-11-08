# Archivo Carcass

Sitio estático para GitHub Pages (Jekyll). El lore son archivos Markdown; cada uno elige cómo se ve.

## Publicar
1. Crea un repositorio en GitHub y sube todo este contenido.
2. Settings → Pages → «Deploy from a branch» → `main` / `(root)`.
3. Si la URL es `usuario.github.io/nombre-repo`, escribe `baseurl: "/nombre-repo"` en `_config.yml`.

## Añadir un documento
Crea un `.md` en `_archivo/` con este encabezado y escribe debajo:

    ---
    layout: newspaper      # newspaper | letter | typed | transcript
    title: Titular o asunto
    category: Prensa       # agrupa los documentos en el índice
    ---

Campos extra por tipo: `paper`, `issue`, `date_text` (periódico); `place`, `date_text` (carta); `office`, `file`, `date_text`, `stamp`, `handnote` (mecanografiado); `source`, `date_text`, `audio` (transcripción).
Enlaces entre documentos: `[texto]({{ '/archivo/nombre-del-archivo/' | relative_url }})`.

Marcas dentro del texto: `<span class="strike">tachado</span>`, `<span class="redact">censurado</span>`, `<span class="hand">nota a mano</span>`, `<span class="sound">[estática]</span>`, `<span class="stamp">SELLO</span>`.

## Radio
- Mete los mp3 en `assets/audio/estatica`, `canciones`, `voces` (o carpetas nuevas). Entran solos.
- `_data/radio.yml` define las emisoras: cada una tiene capas (`layers`) que barajan una carpeta y suenan por separado, así que pueden superponerse. La estática (`static_pool`) se mezcla en todas.
- `seek: true` empieza cada pista en un punto aleatorio, como una emisora real.
- Los mp3 de `grabaciones/` no entran en la radio: son los que reproduce el botón de una transcripción (y la radio baja de volumen mientras suenan).

## Probar en tu ordenador
Hace falta Jekyll (`bundle exec jekyll serve`). Abriendo los archivos directamente la radio no encuentra los mp3.
