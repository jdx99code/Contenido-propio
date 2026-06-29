import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

/*
  ─────────────────────────────────────────────────────────────
  CONFIGURACIÓN DEL ENDPOINT DE ENVÍO
  ─────────────────────────────────────────────────────────────
  Cambia esta URL al endpoint real antes de lanzar a producción:

    · Formspree:       "https://formspree.io/f/YOUR_FORM_ID"
    · Netlify Forms:   "/__forms" (requiere atributo `netlify` en <form>)
    · Endpoint propio: "https://tu-api.com/contacto"

  Mientras FORM_ENDPOINT sea "" (vacío), el formulario opera en
  MODO DEMO: valida correctamente y muestra el estado de éxito
  sin enviar ningún dato. Seguro para desarrollo y staging.
  ─────────────────────────────────────────────────────────────
*/
const FORM_ENDPOINT = ""; // ← PON AQUÍ TU ENDPOINT

/* Spring vivo para el check de éxito — micro-pop */
const checkPopSpring = { type: "spring", stiffness: 260, damping: 12, mass: 0.8 };

/* ── Icono de check animado (estado éxito) ─────────────────────── */
function AnimatedCheck() {
  return (
    <div className="conv-check-wrap" aria-hidden="true">
      <motion.div
        className="conv-check-circle"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={checkPopSpring}
      >
        <svg viewBox="0 0 24 24" fill="none" className="conv-check-svg">
          <motion.path
            d="M5 12.5l4.5 4.5 9-9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Campo de formulario ────────────────────────────────────────── */
function FormField({
  id,
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  rows,
}) {
  const isTextarea = type === "textarea";

  return (
    <div className={`conv-field${error ? " has-error" : ""}`}>
      <label className="conv-label" htmlFor={id}>
        {label}
        {required && (
          <span className="conv-required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      {isTextarea ? (
        <textarea
          className="conv-input conv-textarea"
          id={id}
          name={id}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows || 4}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : undefined}
        />
      ) : (
        <input
          className="conv-input"
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={
            id === "email" ? "email" : id === "name" ? "name" : undefined
          }
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : undefined}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            key={`${id}-error`}
            className="conv-field-error"
            id={`${id}-error`}
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
export default function ConversionMotion({ data }) {
  const [mounted, setMounted] = useState(false);
  /* Estados del formulario: idle | sending | success | error */
  const [formState, setFormState] = useState("idle");
  const [values, setValues] = useState({
    name: "",
    email: "",
    channel: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -6% 0px" });
  const shouldAnimate = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Cambio de campos ─────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    /* Limpia el error del campo al editar */
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  /* ── Validación ───────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    const f = data.formulario.errors;

    if (!values.name.trim()) {
      e.name = f.required;
    }

    if (!values.email.trim()) {
      e.email = f.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      e.email = f.email;
    }

    if (values.channel.trim()) {
      try {
        new URL(values.channel.trim());
      } catch {
        e.channel = f.url;
      }
    }

    if (!values.message.trim()) {
      e.message = f.required;
    }

    if (!values.consent) {
      e.consent = f.consent;
    }

    return e;
  };

  /* ── Envío ────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      /* Mueve el foco al primer campo con error — accesibilidad */
      setTimeout(() => {
        const first = document.querySelector(
          ".conv-field.has-error .conv-input, .conv-consent.has-error .conv-consent-check"
        );
        if (first) first.focus();
      }, 50);
      return;
    }

    setErrors({});
    setGlobalError("");
    setFormState("sending");

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            channel: values.channel.trim() || undefined,
            message: values.message.trim(),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        /* MODO DEMO — simulación de latencia de red sin envío real */
        await new Promise((r) => setTimeout(r, 900));
      }

      setFormState("success");
      setValues({
        name: "",
        email: "",
        channel: "",
        message: "",
        consent: false,
      });
    } catch (err) {
      console.error("[ConversionMotion] submit error:", err);
      setFormState("error");
      setGlobalError(data.formulario.states.error);
    }
  };

  const isSending = formState === "sending";
  const isSuccess = formState === "success";

  return (
    <section
      id="formulario"
      className="conv-section"
      data-section="conversion"
      aria-label={data.ctaFinal.eyebrow}
      ref={sectionRef}
    >
      <div className="container conv-inner">

        {/* ── COLUMNA IZQUIERDA: Cierre emocional ─────────────── */}
        <div className="conv-cta">
          <MotionReveal className="conv-kicker" delay={0}>
            <span className="eyebrow conv-eyebrow">
              {data.ctaFinal.eyebrow}
            </span>
            <span className="rule-draw" aria-hidden="true" />
          </MotionReveal>

          <MotionReveal as="h2" className="conv-title" delay={0.1}>
            <span className="conv-title-l1">{data.ctaFinal.title.line1}</span>
            <span className="conv-title-l2">{data.ctaFinal.title.line2}</span>
          </MotionReveal>

          <MotionReveal as="p" className="conv-lead" delay={0.22}>
            {data.ctaFinal.lead}
          </MotionReveal>

          <MotionReveal className="conv-trust" delay={0.34} aria-label="Señales de confianza">
            <svg
              className="conv-trust-icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.4"
                opacity="0.5"
              />
              <path
                d="M5 8.5l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{data.ctaFinal.trust}</span>
          </MotionReveal>
        </div>

        {/* ── COLUMNA DERECHA: Tarjeta del formulario ─────────── */}
        <motion.div
          className="conv-card"
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0 },
          }}
          initial={false}
          animate={!shouldAnimate || isInView ? "visible" : "hidden"}
          transition={
            !shouldAnimate
              ? reducedTransition
              : { ...signatureSpring, delay: 0.16 }
          }
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (

              /* ── Estado de ÉXITO ──────────────────────────── */
              <motion.div
                key="success"
                className="conv-success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={signatureSpring}
                role="status"
                aria-live="polite"
              >
                <AnimatedCheck />
                <p className="conv-success-title">
                  {data.formulario.states.success.title}
                </p>
                <p className="conv-success-body">
                  {data.formulario.states.success.body}
                </p>
              </motion.div>

            ) : (

              /* ── Formulario ──────────────────────────────── */
              <motion.form
                key="form"
                className="conv-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de contacto"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* Nombre */}
                <FormField
                  id="name"
                  label={data.formulario.fields.name.label}
                  type="text"
                  required={data.formulario.fields.name.required}
                  placeholder={data.formulario.fields.name.placeholder}
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                  disabled={isSending}
                />

                {/* Email */}
                <FormField
                  id="email"
                  label={data.formulario.fields.email.label}
                  type="email"
                  required={data.formulario.fields.email.required}
                  placeholder={data.formulario.fields.email.placeholder}
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isSending}
                />

                {/* Canal YouTube (opcional) */}
                <FormField
                  id="channel"
                  label={data.formulario.fields.channel.label}
                  type="url"
                  required={data.formulario.fields.channel.required}
                  placeholder={data.formulario.fields.channel.placeholder}
                  value={values.channel}
                  onChange={handleChange}
                  error={errors.channel}
                  disabled={isSending}
                />

                {/* Mensaje */}
                <FormField
                  id="message"
                  label={data.formulario.fields.message.label}
                  type="textarea"
                  required={data.formulario.fields.message.required}
                  placeholder={data.formulario.fields.message.placeholder}
                  value={values.message}
                  onChange={handleChange}
                  error={errors.message}
                  disabled={isSending}
                  rows={4}
                />

                {/* ── Consentimiento RGPD ───────────────────── */}
                {/*
                  Texto de consentimiento aislado en es.json > formulario.consent
                  para sustituirlo fácilmente al clonar para otro idioma/país.
                */}
                <div className={`conv-consent${errors.consent ? " has-error" : ""}`}>
                  <label className="conv-consent-label">
                    <input
                      className="conv-consent-check"
                      type="checkbox"
                      name="consent"
                      checked={values.consent}
                      onChange={handleChange}
                      disabled={isSending}
                      aria-describedby={
                        errors.consent ? "consent-error" : undefined
                      }
                      aria-invalid={errors.consent ? "true" : undefined}
                      aria-required="true"
                    />
                    <span className="conv-consent-text">
                      {data.formulario.consent.prefix}
                      <a
                        href={data.formulario.consent.linkHref}
                        className="conv-consent-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.formulario.consent.linkLabel}
                      </a>
                      {data.formulario.consent.suffix}
                    </span>
                  </label>
                  <AnimatePresence>
                    {errors.consent && (
                      <motion.p
                        key="consent-error"
                        className="conv-field-error"
                        id="consent-error"
                        role="alert"
                        aria-live="polite"
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {errors.consent}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Error global (fallo de red) ───────────── */}
                <AnimatePresence>
                  {globalError && (
                    <motion.p
                      key="global-error"
                      className="conv-global-error"
                      role="alert"
                      aria-live="assertive"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {globalError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* ── Botón de envío ────────────────────────── */}
                <div className="conv-submit-wrap">
                  <motion.button
                    className="button button-primary conv-submit"
                    type="submit"
                    disabled={isSending}
                    aria-busy={isSending}
                    {...(shouldAnimate && !isSending
                      ? {
                          whileHover: {
                            y: -2,
                            scale: 1.015,
                            transition: softSpring,
                          },
                          whileTap: { scale: 0.97 },
                        }
                      : {})}
                  >
                    {isSending ? (
                      <>
                        <span className="conv-spinner" aria-hidden="true" />
                        {data.formulario.states.sending}
                      </>
                    ) : (
                      data.formulario.submit
                    )}
                  </motion.button>

                  <p className="conv-microcopy">{data.formulario.microcopy}</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
