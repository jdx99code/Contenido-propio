# Contenido Propio - Contexto del Proyecto

## Objetivo

Landing page premium en español para **Contenido Propio**, agencia de contenido estrategico para YouTube: edicion, miniaturas, SEO y publicacion para creadores.

La direccion visual es editorial premium, clara, sobria y con mucho aire. Inspiracion general: limpieza tipo Stripe/Linear con caracter de revista. No debe sentirse como plantilla generica.

## Stack

- Astro 7 con adaptador de Vercel. La web sigue siendo mayoritariamente prerenderizada, pero `/api/aplicar` corre como función server-side.
- React solo para componentes interactivos realmente necesarios.
- Framer Motion solo cuando aporta valor y nunca para envolver contenido Astro.
- Lenis para scroll suave global.
- Tailwind integrado junto con CSS plano y custom properties.
- Fuentes self-hosted (`@fontsource`, `font-display: swap`), solo los pesos usados:
  - Playfair Display **600** para titulares (unico peso).
  - Inter **400/500/600/700** para cuerpo/interfaz.
  - `Layout.astro` hace preload de Playfair 600 e Inter 400 (los del primer render).

Comandos:

```bash
npm run dev
npm run build
```

URL local usada durante desarrollo:

```text
http://127.0.0.1:4322/
```

## Arquitectura

Principio clave: **contenido separado de diseno**.

- El contenido global del sitio vive en `src/content/es.json`.
- El copy de cada pagina vive en `src/content/es/*.json`.
- Los componentes no deben tener copy escrito a fuego salvo placeholders tecnicos inevitables.
- Esto prepara la web para duplicar idioma cambiando solo los JSON.
- `site.title`, `site.description`, `site.logo` y la metadata global viven en `src/content/es.json`.

SEO tecnico:

- `astro.config.mjs` define la URL de produccion en `site`.
- `astro.config.mjs` usa `@astrojs/vercel` para desplegar funciones server-side en Vercel.
- `Layout.astro` construye canonical, Open Graph, Twitter Cards y JSON-LD a partir de `Astro.site` y `src/content/es.json`.
- `Layout.astro` emite siempre Organization + WebSite JSON-LD, y ademas acepta
  props opcionales con datos por pagina: `faqItems` (FAQPage), `breadcrumb`
  (BreadcrumbList) y `service` (Service). Cada pagina los pasa desde su JSON
  (`page.faq.items`, `page.breadcrumb`, `page.schemaService`).
- REGLA: el schema FAQPage debe construirse SIEMPRE desde los items que la
  pagina renderiza de verdad (Google exige que el JSON-LD coincida con el
  contenido visible). La home pasa `home.faq.items`; el bloque `faq` de
  `es.json` es legado y no debe usarse para el schema.
- Las sub-paginas de `ContentPage.astro` renderizan migas de pan visibles
  (clave `breadcrumb.label` en su JSON) y una seccion FAQ opcional (clave
  `faq` con `eyebrow`, `title`, `items`) reutilizando `FAQAccordion`.
- `@astrojs/sitemap` genera `sitemap-index.xml`.
- `public/robots.txt` permite rastreo completo y apunta al sitemap absoluto.
- `public/logo-512.png` es el logo canonico para Organization JSON-LD.
- `public/og-image.jpg` es la imagen social principal (1200x630); su alt vive
  en `site.ogImageAlt` de `es.json`.
- El `hreflang x-default` solo se emite cuando hay `alternates` reales.

Accesibilidad global:

- `Layout.astro` pinta un enlace "Saltar al contenido" (`.skip-link` en
  `base.css`) que apunta a `#contenido`; el `<main>` de cada pagina debe
  llevar `id="contenido"`.
- El menu movil de `NavBar.astro` es un `<details>` que funciona sin JS; con
  JS se cierra al pulsar un enlace, con Escape y al hacer click fuera.

Estructura relevante (limpia; sin componentes muertos):

```text
src/
  components/
    fe/                       # componentes activos que ensamblan el sitio
      AnimatedSection.astro   # wrapper .reveal (CSS + IntersectionObserver)
      AnimatedPipeline.astro
      ContentPage.astro       # plantilla de las sub-paginas SEO
      FAQAccordion.astro
      Footer.astro
      MagneticButton.astro
      NavBar.astro
      ParticleField.astro
      PremiumHeroVisual.astro
      PremiumLoader.astro
      TiltCard.astro
      AplicarWizard.jsx       # UNICA isla React (formulario /aplicar, client:idle)
    Header.astro              # solo lo usa /privacidad
  content/
    es.json
    es/
      *.json                  # home, aplicar, contacto, sobre, proceso, nichos, etc.
  layouts/
    Layout.astro
  pages/
    index.astro
    404.astro               # pagina de error personalizada (noindex, copy en es/404.json)
    aplicar.astro
    contacto.astro
    sobre-nosotros.astro
    proceso.astro
    privacidad.astro
    styleguide.astro
    edicion-videos-faceless.astro
    miniaturas-seo-youtube.astro
    gestion-canales-youtube.astro
    videos-faceless-youtube.astro
    nichos-youtube-faceless.astro
    crear-canal-youtube-sin-mostrar-la-cara.astro
    api/
      aplicar.ts              # endpoint server-side del formulario
  styles/
    index.css                # tokens activos + utilidades (importado en Layout)
    base.css                 # reset + a11y base (importado en Layout)
    tokens.css               # LEGADO, no importado por Layout
public/
  robots.txt
  og-image.jpg
  logo-512.png
  logo.svg
  social-proof.png           # captura YouTube Studio (fallback PNG optimizado)
  social-proof.webp          # version moderna servida por <picture>
  social-proof.avif          # version moderna (la mas ligera) servida por <picture>
```

Nota: la home y las sub-paginas SEO se ensamblan directamente en sus `.astro`
con los componentes de `fe/`. No existen componentes de seccion sueltos ni islas
`motion/*`: ese codigo legacy se elimino porque no lo importaba ninguna pagina.

## Sistema de Diseno

Tokens principales en `src/styles/index.css`.

Colores aprobados:

- Fondo crema principal: `#FAF8F4`.
- Tinta principal: `stone-900` / `stone-800`.
- Tinta calida editorial: `--ink-warm` en sepia/marron tostado.
- Rojo YouTube: `#E62117`.
- Verde de datos: `#15803d`.

Regla estricta del rojo:

- Solo detalles: puntos, iconos pequenos, reglas finas, datos puntuales, hover.
- Nunca como fondo de seccion ni boton primario.
- No debe ocupar mas de aproximadamente 5% de superficie.

Rojo accesible en texto (AA):

- `--accent` (fondo/borde/relleno de marca: `bg-accent`, puntos, icono play) se
  mantiene en el `#E62117` exacto. NO cambiarlo.
- Cuando el rojo es **texto** usa los tokens accesibles, porque `#E62117` no cumple
  AA a tamano pequeno: `--accent-text` (`#c61e15`) sobre fondos claros y
  `--accent-text-on-dark` (`#ef5a4f`) sobre secciones oscuras. La utilidad
  `.text-accent` ya resuelve a estos valores (override en `index.css`).

Primitivos ya existentes:

- Grano de papel sutil sobre el fondo crema.
- Elevaciones calidas: `raised`, `floating`, `overlay`.
- Sombras de tarjeta via utilidades Tailwind `shadow-warm-card` y
  `shadow-warm-card-hover` (mapeadas en `tailwind.config.js` a los tokens
  `--shadow-card` / `--shadow-card-hover`). NUNCA usar `shadow-[var(--x)]`:
  Tailwind interpreta la variable como color de sombra y no pinta nada.
- `--ease-premium`: curva elegante para movimiento.
- `.gradient-text`, `.card-hover`, `.reveal`.
- Microinteracciones de botones/enlaces.

Botones:

- Primario: tinta oscura sobre crema.
- Secundario: contorno fino sobre crema.
- Inverse: crema sobre tinta para fondos oscuros.

## Movimiento

- Framer Motion solo se usa en componentes aislados que realmente requieren estado, gestos o animacion propia.
- No usar islas React para envolver contenido Astro con el unico fin de revelar secciones.
- El reveal de entrada de secciones ahora es CSS + `IntersectionObserver` ligero desde `Layout.astro` con `.reveal`.
- SSR / sin JS / pre-hidratacion siempre debe mostrar el contenido.
- Respetar siempre `prefers-reduced-motion`.
- El cluster legacy `motion/*` (incluido `MotionReveal.jsx`) se elimino. Los
  nuevos reveals van siempre por `.reveal` + `IntersectionObserver`.
- La unica isla React del sitio es `AplicarWizard.jsx` (`client:idle`). No
  introducir mas islas salvo interaccion real imprescindible.

## Secciones Implementadas

### Header

Archivo: `src/components/fe/NavBar.astro`

Header sticky con scroll reactivo y menu movil, renderizado en HTML servidor.

### Hero

Archivo: `src/pages/index.astro`

Hero ensamblado en Astro con datos desde `src/content/es/home.json`.

### Resultados

Parte de `src/pages/index.astro`.

Datos actuales:

- `4,3M` visualizaciones, `+16%`.
- `328,5K` horas, `+14%`.
- `+40,2K` nuevos suscriptores, `+18%`.
- `10.341 €` ingresos estimados, `+17%`.

Diseno actual:

- Panel editorial con cuatro metricas integradas.
- Captura real de YouTube Studio en `public/social-proof.png`.
- Números de resultados en negro; porcentajes en verde.

### Problema / Solucion

Parte de `src/pages/index.astro`.

Dos tarjetas enfrentadas con acento rojo minimo y datos en verde cuando toca.

### Servicios

Parte de `src/pages/index.astro`.

Seis tarjetas sobrias con iconos de linea fina y micro-acento rojo solo en hover.

### Faceless

Parte de `src/pages/index.astro`.

Seccion de dos caminos entre Servicios y Especializacion.

### Especializacion

Parte de `src/pages/index.astro`.

Bloque centrado con logo de YouTube y tres pilares.

### Proceso

Parte de `src/pages/index.astro`.

Seccion de 6 pasos con `AnimatedPipeline.astro`.

### Entregables

Concepto historico. El componente `Entregables.astro` se elimino por no usarse.
Si se recupera, su copy debe vivir en JSON.

### Testimonios

Parte de `src/pages/index.astro`, entre Alcance y Para Quien.

- Tres tarjetas `figure/blockquote/figcaption` con cita, dato en verde y persona.
- Copy en `home.json` clave `testimonios`. Los datos actuales son PLACEHOLDERS
  que el usuario sustituira por testimonios reales (nombres, cifras y fotos).
- Avatares placeholder en `public/avatars/*.svg` (iniciales); se reemplazan
  cambiando el fichero o la ruta `avatar.src` del JSON.
- NO añadir schema Review/AggregateRating mientras los testimonios no sean reales.

### Para Quien

Parte de `src/pages/index.astro`.

### FAQ

Parte de `src/pages/index.astro` con `FAQAccordion.astro` y `<details>`.

### Conversion

Parte de `src/pages/index.astro`.

Cierre oscuro con CTA.

### Footer

Archivo: `src/components/fe/Footer.astro`

Footer en Astro, renderizado en servidor.

## Styleguide

Archivo: `src/pages/styleguide.astro`.

Sirve para revisar:

- Paleta.
- Tipografia.
- Botones.
- Tarjetas.
- Elevaciones.
- Grano on/off.
- Reveal y regla roja.
- Componentes FE en aislamiento.

Mantenerla actualizada cuando se cambien primitives globales.

## Decisiones y Restricciones Importantes

- Rendimiento primero: HTML estatico por defecto.
- JS solo donde aporta movimiento/interaccion real.
- `astro.config.mjs` usa `build.inlineStylesheets: 'always'` para eliminar el CSS
  bloqueante de render (mejor FCP/LCP).
- Imagenes de contenido: servir con `<picture>` (avif/webp + fallback), con
  `width`/`height`, `loading="lazy"` y `decoding="async"` bajo el pliegue. Las
  rutas de cada formato viven en el JSON de la pagina, no a fuego en el componente.
- Objetivo de calidad (Lighthouse movil, build de produccion): 90+ en
  Rendimiento, Accesibilidad y Buenas practicas. Cero scroll horizontal a 375px.
- No usar `client:load` para wrappers de contenido ni revelar texto con React.
- Accesibilidad: contraste AA, semantica correcta, reduced motion.
- Nada de contenido hardcodeado en componentes si pertenece al copy de la web.
- Rojo muy disciplinado; verde solo para datos de rendimiento/crecimiento.
- No construir secciones futuras hasta que se pidan.
- El formulario `/aplicar` postea a `/api/aplicar`; ese endpoint lee `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `RESEND_API_KEY` y `LEAD_ORIGIN` desde `.env` local o variables de entorno de Vercel.
- `.env`, `.env.local` y `.vercel/` no se versionan.
- Si hay que cerrar puertos/procesos locales, el usuario ya autorizo hacerlo sin preguntar.

## Estado Actual

`src/pages/index.astro` renderiza la home completa con:

1. PremiumLoader (solo primera vista de la sesion via sessionStorage
   `cp-loader-seen`; se omite con prefers-reduced-motion)
2. NavBar
3. Hero
4. Prueba social
5. Stats bar
6. Problema / solucion
7. Servicios
8. Especializacion
9. Como funciona
10. Alcance
11. Testimonios (placeholders pendientes de datos reales)
12. Para quien
13. FAQ
14. CTA final
15. Footer

Header actual:

- Navegacion completa con anclas a Servicios, Como funciona, Para quien y FAQ.
- CTA destacado `Solicitar informacion` con enlace a `/aplicar`.
- Sticky con reaccion al scroll en JS ligero.

Contenido y SEO actuales:

- H1 del hero se mantiene como `Un canal de YouTube que crece sin que aparezcas.`
- Title y meta description viven en `src/content/es.json`.
- `Layout.astro` emite JSON-LD de Organization y WebSite en todas las paginas;
  FAQPage, BreadcrumbList y Service se emiten por pagina via props.
- Las 5 paginas de servicio + nichos + proceso tienen seccion FAQ propia con
  su FAQPage schema; todas las sub-paginas tienen migas de pan.
- `site.logo` apunta a `/logo-512.png`.
- La captura de YouTube Studio vive en `public/social-proof.png`.

Regla operativa importante:

- Los reveals de seccion usan `.reveal` + `IntersectionObserver` en `Layout.astro`.
- No volver a crear islas React que envuelvan `children` de Astro para animar entradas.
- Los cambios de `/aplicar` deben preservar progressive enhancement: sin JS se ven todos los pasos y el formulario sigue enviando por POST nativo.

Build verificada con:

```bash
npm run build
```

La ultima build paso correctamente.
