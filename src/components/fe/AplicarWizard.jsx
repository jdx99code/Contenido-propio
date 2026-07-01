import { ArrowLeft, ArrowRight, Check, Euro, FileText, User, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const iconMap = {
  Euro,
  FileText,
  User,
  Youtube: Video,
};

function formatProgress(template, current, total) {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

function fieldId(stepId, name, value) {
  return [stepId, name, value].filter(Boolean).join("-");
}

function getFormControls(container) {
  return Array.from(container.querySelectorAll("input, textarea, select"));
}

function validateStep(stepElement) {
  const controls = getFormControls(stepElement);
  for (const control of controls) {
    if (!control.checkValidity()) {
      control.reportValidity();
      control.focus();
      return false;
    }
  }
  return true;
}

function Honeypot({ field }) {
  return (
    <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={field.name}>{field.label}</label>
      <input id={field.name} name={field.name} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function TextField({ field, stepId }) {
  const id = fieldId(stepId, field.name);
  const isTextarea = field.kind === "textarea";
  const inputClass =
    "w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent/15";

  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-800" htmlFor={id}>
      <span>
        {field.label}
        {field.required ? <span className="text-accent"> *</span> : null}
      </span>
      {isTextarea ? (
        <textarea
          id={id}
          name={field.name}
          placeholder={field.placeholder}
          rows={field.rows || 5}
          required={field.required}
          className={`${inputClass} min-h-36 resize-y`}
        />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type || "text"}
          placeholder={field.placeholder}
          required={field.required}
          autoComplete={field.autocomplete}
          className={inputClass}
        />
      )}
    </label>
  );
}

function RadioField({ field, stepId }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold text-stone-800">
        {field.label}
        {field.required ? <span className="text-accent"> *</span> : null}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {field.options.map((option) => {
          const id = fieldId(stepId, field.name, option.value);
          return (
            <label
              key={option.value}
              htmlFor={id}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-accent/30 hover:bg-secondary/40 has-[:checked]:border-accent/50 has-[:checked]:bg-accent/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/15"
            >
              <input
                id={id}
                name={field.name}
                type="radio"
                value={option.value}
                required={field.required}
                className="h-4 w-4 border-border text-accent accent-[var(--youtube-red)]"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ConsentField({ field, stepId }) {
  const id = fieldId(stepId, field.name);
  const [before, after] = field.label.split(field.linkLabel);

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer gap-3 rounded-[var(--radius)] border border-border bg-secondary/35 p-4 text-sm leading-6 text-stone-700 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/15"
    >
      <input
        id={id}
        name={field.name}
        type="checkbox"
        value="aceptado"
        required={field.required}
        className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent accent-[var(--youtube-red)]"
      />
      <span>
        {before}
        <a href={field.linkHref} className="font-semibold text-accent no-underline transition hover:text-stone-950">
          {field.linkLabel}
        </a>
        {after}
        {field.required ? <span className="text-accent"> *</span> : null}
      </span>
    </label>
  );
}

function FormField({ field, stepId }) {
  if (field.kind === "radio") {
    return <RadioField field={field} stepId={stepId} />;
  }

  if (field.kind === "consent") {
    return <ConsentField field={field} stepId={stepId} />;
  }

  return <TextField field={field} stepId={stepId} />;
}

export default function AplicarWizard({ content }) {
  const formRef = useRef(null);
  const [enhanced, setEnhanced] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const steps = content.steps || [];
  const total = steps.length;
  const current = steps[currentStep];
  const isLastStep = currentStep === total - 1;

  useEffect(() => {
    setEnhanced(true);
  }, []);

  const goNext = () => {
    const stepElement = formRef.current?.querySelector(`[data-step-panel="${currentStep}"]`);
    if (!stepElement || !validateStep(stepElement)) {
      return;
    }

    setError("");
    setCurrentStep((step) => Math.min(step + 1, total - 1));
  };

  const goBack = () => {
    setError("");
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async (event) => {
    if (!enhanced) {
      return;
    }

    event.preventDefault();
    setError("");

    if (!formRef.current?.reportValidity()) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(content.action, {
        method: content.method,
        headers: {
          Accept: "application/json",
        },
        body: new FormData(formRef.current),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok !== true) {
        throw new Error("submit_failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError(content.messages.error);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[1.5rem] border border-border bg-background p-8 text-center shadow-[var(--shadow-card)] md:p-12">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/5 text-accent">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight text-stone-950 md:text-5xl">
          {content.messages.successTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-stone-600">{content.messages.successBody}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={content.action}
      method={content.method}
      onSubmit={handleSubmit}
      className="relative rounded-[1.5rem] border border-border bg-background p-5 shadow-[var(--shadow-card)] md:p-8"
      data-aplicar-wizard
      data-enhanced={enhanced ? "true" : "false"}
    >
      <Honeypot field={content.honeypot} />

      <div className="mb-8 grid gap-5 border-b border-border pb-7">
        <p className="text-sm font-semibold text-stone-500">{formatProgress(content.progressLabel, currentStep + 1, total)}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] || FileText;
            const isActive = enhanced ? index === currentStep : index === 0;
            const isDone = enhanced && index < currentStep;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-[var(--radius)] border px-3 py-3 text-sm transition ${
                  isActive || isDone
                    ? "border-accent/30 bg-accent/5 text-accent"
                    : "border-border bg-secondary/30 text-stone-500"
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current/20">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-semibold">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8">
        {steps.map((step, index) => {
          const visible = !enhanced || index === currentStep;
          const activeStep = index === currentStep;
          return (
            <section
              key={step.id}
              data-step-panel={index}
              data-active-step={activeStep ? "true" : "false"}
              hidden={!visible}
              className="grid gap-6 motion-safe:transition motion-safe:duration-300"
              aria-labelledby={`${step.id}-title`}
            >
              <div className="grid gap-2">
                <h2 id={`${step.id}-title`} className="font-heading text-4xl font-semibold leading-tight text-stone-950 md:text-5xl">
                  {step.title}
                </h2>
                <p className="text-base leading-7 text-stone-600">{step.subtitle}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {step.fields.map((field) => (
                  <div key={field.name} className={field.kind === "textarea" || field.kind === "consent" || field.kind === "radio" ? "md:col-span-2" : ""}>
                    <FormField field={field} stepId={step.id} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {error ? (
        <p className="mt-6 rounded-[var(--radius)] border border-accent/20 bg-accent/5 px-4 py-3 text-sm font-medium text-stone-800" role="alert">
          {error}
        </p>
      ) : null}

      {enhanced ? (
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0 || status === "submitting"}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-background px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-accent/25 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {content.buttons.back}
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-75"
            >
              {status === "submitting" ? content.buttons.submitting : content.buttons.submit}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-stone-800"
            >
              {content.buttons.continue}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 border-t border-border pt-6">
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground sm:w-auto"
          >
            {content.buttons.submit}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </form>
  );
}
