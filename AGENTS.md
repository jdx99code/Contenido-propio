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
- Nota legal discreta.
- Hay un slot comentado para captura real de YouTube Studio; no inventar replicas falsas.

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

Componentes de secciones futuras existen como archivos, pero siguen vacios o pendientes:

- Servicios
- Especializacion
- Proceso
- Entregables
- ParaQuien
- FAQ
- CTAFinal
- Formulario
- Footer

Build verificada con:

```bash
npm run build
```

La ultima build paso correctamente.
