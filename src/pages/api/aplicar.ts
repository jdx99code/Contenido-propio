import type { APIRoute } from "astro";

export const prerender = false;

const AIRTABLE_TABLE = "Leads";
const RESEND_FROM = "onboarding@resend.dev";
const RESEND_TO = ["jorgedih99@gmail.com"];

const SELECT_LABELS = {
  estado_canal: {
    empezar_de_cero: "Empezar de cero",
    escalar_canal_existente: "Escalar un canal existente",
  },
  numero_canales: {
    un_canal: "Un canal",
    varios_canales: "Varios canales",
  },
  tipo_canal: {
    finanzas_inversion: "Finanzas e inversión",
    negocios_emprendimiento: "Negocios y emprendimiento",
    desarrollo_personal: "Desarrollo personal",
    educacion_divulgacion: "Educación y divulgación",
    tecnologia: "Tecnología",
    salud_bienestar: "Salud y bienestar",
    otro: "Otro (abierto a investigar)",
  },
  presupuesto_mensual: {
    "1000_2500": "1.000-2.500 €/mes",
    "2500_5000": "2.500-5.000 €/mes",
    "5000_10000": "5.000-10.000 €/mes",
    "10000_mas": "10.000+ €/mes",
    hablemoslo: "Hablémoslo",
  },
  objetivo_principal: {
    monetizar_canal: "Monetizar un canal",
    autoridad_marca: "Construir autoridad de marca",
    leads_entrantes: "Generar leads entrantes",
    activo_digital: "Crear un activo digital",
    escalar_varios_canales: "Escalar varios canales",
    otro: "Otro",
  },
} as const;

const SELECT_FIELD_NAMES = [
  "Punto de partida",
  "Nº de canales",
  "Tipo de canal",
  "Presupuesto",
  "Objetivo",
] as const;

type FormDataMap = Record<string, string>;
type AirtableFields = Record<string, string>;

function getEnv(name: "AIRTABLE_TOKEN" | "AIRTABLE_BASE_ID" | "RESEND_API_KEY" | "LEAD_ORIGIN") {
  return String(import.meta.env[name] || process.env[name] || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function jsonResponse(body: { ok: boolean; error?: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function labelFor<T extends keyof typeof SELECT_LABELS>(field: T, value: string) {
  const labels = SELECT_LABELS[field] as Record<string, string>;
  return labels[value] || value;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function parseRequest(request: Request): Promise<FormDataMap> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    return Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, typeof value === "string" ? value : String(value ?? "")]),
    );
  }

  const form = await request.formData().catch(() => null);
  if (form) {
    return Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, typeof value === "string" ? value : ""]));
  }

  const text = await request.text();
  return Object.fromEntries(new URLSearchParams(text).entries());
}

function validate(data: FormDataMap) {
  const required = [
    ["nombre", "El nombre es obligatorio."],
    ["email", "El email es obligatorio."],
    ["pais", "El país es obligatorio."],
    ["presupuesto_mensual", "El presupuesto es obligatorio."],
    ["consentimiento_privacidad", "Debes aceptar la política de privacidad."],
  ] as const;

  for (const [field, message] of required) {
    if (!clean(data[field])) {
      return message;
    }
  }

  if (!isEmail(clean(data.email))) {
    return "El email no tiene un formato válido.";
  }

  return "";
}

function buildFields(data: FormDataMap, origin: string): AirtableFields {
  return {
    Nombre: clean(data.nombre),
    Email: clean(data.email),
    Teléfono: clean(data.telefono),
    País: clean(data.pais),
    Negocio: clean(data.negocio),
    "Situación YouTube": clean(data.situacion_youtube),
    "Punto de partida": labelFor("estado_canal", clean(data.estado_canal)),
    "Nº de canales": labelFor("numero_canales", clean(data.numero_canales)),
    "Tipo de canal": labelFor("tipo_canal", clean(data.tipo_canal)),
    Presupuesto: labelFor("presupuesto_mensual", clean(data.presupuesto_mensual)),
    Objetivo: labelFor("objetivo_principal", clean(data.objetivo_principal)),
    Notas: clean(data.mensaje),
    Origen: origin,
  };
}

function compactFields(fields: AirtableFields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== ""));
}

function fieldsWithoutSelects(fields: AirtableFields) {
  const fallback = { ...fields };
  const selectNotes = SELECT_FIELD_NAMES.flatMap((field) => (fallback[field] ? [`${field}: ${fallback[field]}`] : []));

  for (const field of SELECT_FIELD_NAMES) {
    delete fallback[field];
  }

  if (selectNotes.length > 0) {
    fallback.Notas = [fallback.Notas, `Selecciones recibidas: ${selectNotes.join(" | ")}`].filter(Boolean).join("\n\n");
  }

  return fallback;
}

function buildEmailText(fields: AirtableFields) {
  const labels = [
    "Nombre",
    "Email",
    "Teléfono",
    "País",
    "Negocio",
    "Situación YouTube",
    "Punto de partida",
    "Nº de canales",
    "Tipo de canal",
    "Presupuesto",
    "Objetivo",
    "Notas",
    "Origen",
  ];

  return labels.map((label) => `${label}: ${fields[label] || "-"}`).join("\n");
}

async function createAirtableRecord(fields: AirtableFields, allowSelectFallback = true) {
  const airtableToken = getEnv("AIRTABLE_TOKEN");
  const airtableBaseId = getEnv("AIRTABLE_BASE_ID");

  if (!airtableToken || !airtableBaseId) {
    throw new Error("missing_airtable_env");
  }

  const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${airtableToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: compactFields(fields) }),
  });

  if (response.ok) {
    return response;
  }

  if (allowSelectFallback && response.status === 422) {
    const fallbackFields = fieldsWithoutSelects(fields);
    const fallbackResponse = await createAirtableRecord(fallbackFields, false);
    return fallbackResponse;
  }

  throw new Error(`airtable_${response.status}`);
}

async function sendLeadEmail(fields: AirtableFields) {
  const resendApiKey = getEnv("RESEND_API_KEY");

  if (!resendApiKey) {
    throw new Error("missing_resend_env");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: RESEND_TO,
      subject: `Nuevo lead — ${fields.Nombre} (${fields.Origen})`,
      text: buildEmailText(fields),
    }),
  });

  if (!response.ok) {
    throw new Error(`resend_${response.status}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const data = await parseRequest(request);

  if (clean(data.website)) {
    return jsonResponse({ ok: true });
  }

  const validationError = validate(data);
  if (validationError) {
    return jsonResponse({ ok: false, error: validationError }, 400);
  }

  const origin = getEnv("LEAD_ORIGIN") || "Contenido Propio";
  const fields = buildFields(data, origin);

  try {
    await createAirtableRecord(fields);
  } catch (error) {
    console.error("Airtable lead save failed", error instanceof Error ? error.message : "unknown_error");

    try {
      await sendLeadEmail(fields);
    } catch (emailError) {
      console.error("Resend fallback failed", emailError instanceof Error ? emailError.message : "unknown_error");
    }

    return jsonResponse({ ok: false }, 500);
  }

  try {
    await sendLeadEmail(fields);
  } catch (error) {
    console.error("Resend lead notification failed", error instanceof Error ? error.message : "unknown_error");
  }

  return jsonResponse({ ok: true });
};
