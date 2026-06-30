# Contenido Propio - Contexto del Proyecto

## Objetivo

Landing page premium en español para **Contenido Propio**, agencia de contenido estrategico para YouTube: edicion, miniaturas, SEO y publicacion para creadores.

La direccion visual es editorial premium, clara, sobria y con mucho aire. Inspiracion general: limpieza tipo Stripe/Linear con caracter de revista. No debe sentirse como plantilla generica.

## Stack

- Astro 7, salida estatica.
- React solo para islas con movimiento.
- Framer Motion para animaciones premium.
- Lenis para scroll suave global.
- CSS plano con custom properties.
- Sin Tailwind, Bootstrap ni librerias UI genericas.
- Fuentes self-hosted:
  - Fraunces variable para titulares.
  - Inter variable para cuerpo/interfaz.

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

- Todo el texto vive en `src/content/es.json`.
- Los componentes no deben tener copy escrito a fuego salvo placeholders tecnicos inevitables.
- Esto prepara la web para duplicar idioma cambiando solo el JSON.

Estructura relevante:

```text
src/
  components/
    Header.astro
    Hero.astro
    Resultados.astro
    ProblemaSolucion.astro
    motion/
      HeroMotion.jsx
      ResultadosMotion.jsx
      ProblemaSolucionMotion.jsx
      MotionReveal.jsx
      motionConfig.js
  content/
    es.json
  layouts/
    Layout.astro
  pages/
    index.astro
    styleguide.astro
  styles/
    tokens.css
    base.css
```

## Sistema de Diseno

Tokens principales en `src/styles/tokens.css`.

Colores aprobados:

- Fondo crema principal: `#F7F4EF`.
- Tinta principal: `#1A1714`.
- Tinta calida editorial: `--ink-warm` en sepia/marron tostado.
- Rojo YouTube: `#E62117`.

Regla estricta del rojo:

- Solo detalles: puntos, iconos pequenos, reglas finas, datos puntuales, hover.
- Nunca como fondo de seccion ni boton primario.
- No debe ocupar mas de aproximadamente 5% de superficie.

Primitivos ya existentes:

- Grano de papel sutil sobre el fondo crema.
- Elevaciones calidas: `raised`, `floating`, `overlay`.
- `--ease-signature`: curva elegante para movimiento.
- `.rule-draw`: regla roja fina.
- Microinteracciones de botones/enlaces.

Botones:

- Primario: tinta oscura sobre crema.
- Secundario: contorno fino sobre crema.
- Inverse: crema sobre tinta para fondos oscuros.

## Movimiento

Framer Motion se usa solo en islas React, no convertir toda la web a React.

Config de movimiento en `src/components/motion/motionConfig.js`:

- `signatureSpring`: spring principal para entradas.
- `softSpring`: hover/tap.
- `reducedTransition`: sin movimiento.

Importante: respetar siempre `prefers-reduced-motion`.

El reveal reutilizable esta en `MotionReveal.jsx` y ya fue corregido para progressive enhancement:

- SSR / sin JS / pre-hidratacion = visible.
- Solo despues de montar en cliente aplica estado oculto inicial.
- Usa `useInView(..., { once: true, margin: "0px 0px -10% 0px" })`.

No volver a usar un reveal que deje contenido oculto en SSR.

## Secciones Implementadas

### Header

Archivo: `src/components/Header.astro`

Basico, con marca y CTA desde `content/es.json`.

### Hero

Archivos:

- `src/components/Hero.astro`
- `src/components/motion/HeroMotion.jsx`

Contenido bajo `hero` en `es.json`.

Incluye:

- Eyebrow con punto/regla roja.
- H1: "Tu graba." en tinta principal y "Nosotros hacemos que crezca." en `--ink-warm`.
- Lead y dos CTAs.
- Prueba social con avatares de iniciales.
- Dashboard premium tipo panel de canal.
- Badges flotantes.
- Halo LED calido sutil alrededor del panel.
- Parallax y pulso suave, desactivados con reduced motion.

### Resultados

Archivos:

- `src/components/Resultados.astro`
- `src/components/motion/ResultadosMotion.jsx`

Contenido bajo `resultados` en `es.json`.

Datos actuales:

- `4,3M` visualizaciones, `+16%`.
- `328,5K` horas, `+14%`.
- `+40,2K` nuevos suscriptores, `+18%`.
- `10.341 €` ingresos estimados, `+17%`.

Diseno actual:

- Panel editorial con cuatro metricas integradas.
- Count-up al entrar en viewport.
- Captura real de YouTube Studio insertada como referencia visual.
- Nota legal discreta.

### Problema / Solucion

Archivos:

- `src/components/ProblemaSolucion.astro`
- `src/components/motion/ProblemaSolucionMotion.jsx`

Contenido bajo `problemaSolucion` en `es.json`.

Diseno:

- Dos tarjetas enfrentadas.
- Problema: mas apagada, menor elevacion.
- Solucion: mas luminosa, mayor elevacion, detalle rojo minimo.
- Escala ya reducida para no verse demasiado grande.

### Servicios

Archivos:

- `src/components/Servicios.astro`
- `src/components/motion/ServiciosMotion.jsx`

Contenido bajo `servicios` en `es.json`.

Diseno:

- Cabecera centrada con CTA a formulario.
- 6 tarjetas sobrias con iconos de linea fina.
- Micro-acento rojo solo en hover.

### Especializacion

Archivos:

- `src/components/Especializacion.astro`
- `src/components/motion/EspecializacionMotion.jsx`

Contenido bajo `especializacion` en `es.json`.

Diseno:

- Bloque centrado y de respiro.
- Logo de YouTube hecho con CSS/SVG.
- Tres pilares centrados debajo.

### Proceso

Archivos:

- `src/components/Proceso.astro`
- `src/components/motion/ProcesoMotion.jsx`

Contenido bajo `proceso` en `es.json`.

Diseno:

- Seccion estrella con sticky scroll en escritorio.
- Indicador izquierdo con lista de pasos y barra de progreso vertical.
- Columna derecha con 6 pasos anclados y revelado blindado.
- En movil: lista vertical simple, sin sticky.

### Entregables

Archivos:

- `src/components/Entregables.astro`

Contenido bajo `entregables` en `es.json`.

### Para Quien

Archivos:

- `src/components/ParaQuien.astro`
- `src/components/motion/ParaQuienMotion.jsx`

Contenido bajo `paraQuien` en `es.json`.

### FAQ

Archivos:

- `src/components/FAQ.astro`
- `src/components/motion/FaqMotion.jsx`

Contenido bajo `faq` en `es.json`.

### Conversion

Archivos:

- `src/components/Conversion.astro`
- `src/components/motion/ConversionMotion.jsx`

Contenido bajo `ctaFinal` y `formulario` en `es.json`.

Diseno:

- Cierre oscuro con CTA y formulario.
- Es la seccion final de conversion.

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
- Uso correcto de `--ink-warm`.

Mantenerla actualizada cuando se cambien primitives globales.

## Decisiones y Restricciones Importantes

- Rendimiento primero: HTML estatico por defecto.
- JS solo donde aporta movimiento/interaccion real.
- Accesibilidad: contraste AA, semantica correcta, reduced motion.
- Nada de contenido hardcodeado en componentes si pertenece al copy de la web.
- Rojo muy disciplinado.
- No construir secciones futuras hasta que se pidan.
- Si hay que cerrar puertos/procesos locales, el usuario ya autorizo hacerlo sin preguntar.

## Estado Actual

`index.astro` renderiza en orden:

1. Header
2. Hero
3. Resultados
4. ProblemaSolucion
5. Servicios
6. Especializacion
7. Proceso
8. Entregables
9. ParaQuien
10. FAQ
11. Conversion

Componentes restantes siguen vacios o pendientes:

- Footer

Build verificada con:

```bash
npm run build
```

La ultima build paso correctamente.
