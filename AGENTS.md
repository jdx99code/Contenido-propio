# Contenido Propio - Contexto del Proyecto

## Objetivo

Landing page premium en español para **Contenido Propio**, agencia de contenido estrategico para YouTube: edicion, miniaturas, SEO y publicacion para creadores.

La direccion visual es editorial premium, clara, sobria y con mucho aire. Inspiracion general: limpieza tipo Stripe/Linear con caracter de revista. No debe sentirse como plantilla generica.

## Stack

- Astro 7, salida estatica.
- React solo para componentes interactivos realmente necesarios.
- Framer Motion solo cuando aporta valor y nunca para envolver contenido Astro.
- Lenis para scroll suave global.
- Tailwind integrado junto con CSS plano y custom properties.
- Fuentes self-hosted:
  - Playfair Display para titulares.
  - Inter para cuerpo/interfaz.

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
- `Layout.astro` construye canonical, Open Graph, Twitter Cards y JSON-LD a partir de `Astro.site` y `src/content/es.json`.
- `@astrojs/sitemap` genera `sitemap-index.xml`.
- `public/robots.txt` permite rastreo completo y apunta al sitemap absoluto.
- `public/logo-512.png` es el logo canonico para Organization JSON-LD.
- `public/og-image.jpg` es la imagen social principal.

Estructura relevante:

```text
src/
  components/
    fe/
      AnimatedSection.astro
      AnimatedPipeline.astro
      FAQAccordion.astro
      Footer.astro
      MagneticButton.astro
      NavBar.astro
      ParticleField.astro
      PremiumHeroVisual.astro
      PremiumLoader.astro
      TiltCard.astro
    motion/
      HeroMotion.jsx
      ResultadosMotion.jsx
      ProblemaSolucionMotion.jsx
      FacelessMotion.jsx
      MotionReveal.jsx
      motionConfig.js
  content/
    es.json
    es/
      *.json
  layouts/
    Layout.astro
  pages/
    index.astro
    styleguide.astro
  styles/
    index.css
    base.css
public/
  robots.txt
  og-image.jpg
  logo-512.png
  logo.svg
  social-proof.png
```

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

Primitivos ya existentes:

- Grano de papel sutil sobre el fondo crema.
- Elevaciones calidas: `raised`, `floating`, `overlay`.
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
- `MotionReveal.jsx` queda como legado y no debe ser la via de nuevos reveals.

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

Pagina o componente historico fuera de la home. Mantener copy en JSON cuando se use.

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
- No usar `client:load` para wrappers de contenido ni revelar texto con React.
- Accesibilidad: contraste AA, semantica correcta, reduced motion.
- Nada de contenido hardcodeado en componentes si pertenece al copy de la web.
- Rojo muy disciplinado; verde solo para datos de rendimiento/crecimiento.
- No construir secciones futuras hasta que se pidan.
- Si hay que cerrar puertos/procesos locales, el usuario ya autorizo hacerlo sin preguntar.

## Estado Actual

`src/pages/index.astro` renderiza la home completa con:

1. PremiumLoader
2. NavBar
3. Hero
4. Prueba social
5. Stats bar
6. Problema / solucion
7. Servicios
8. Especializacion
9. Como funciona
10. Alcance
11. Para quien
12. FAQ
13. CTA final
14. Footer

Header actual:

- Navegacion completa con anclas a Servicios, Como funciona, Para quien y FAQ.
- CTA destacado `Solicitar informacion` con enlace a `/aplicar`.
- Sticky con reaccion al scroll en JS ligero.

Contenido y SEO actuales:

- H1 del hero se mantiene como `Un canal de YouTube que crece sin que aparezcas.`
- Title y meta description viven en `src/content/es.json`.
- Existe un bloque JSON-LD de Organization y otro de FAQPage en `Layout.astro`.
- `site.logo` apunta a `/logo-512.png`.
- La captura de YouTube Studio vive en `public/social-proof.png`.

Regla operativa importante:

- Los reveals de seccion usan `.reveal` + `IntersectionObserver` en `Layout.astro`.
- No volver a crear islas React que envuelvan `children` de Astro para animar entradas.

Build verificada con:

```bash
npm run build
```

La ultima build paso correctamente.
