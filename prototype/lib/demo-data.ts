import type { CustomerProfile, DetectedQuestion, StructuredAnswer, TranscriptLine } from "./types";

export const advisor = {
  id: "adv_001",
  name: "Laura Martinez",
  officeId: "off_001",
  team: "Atencion presencial",
  seniority: "Asesora nueva",
};

export const office = {
  id: "off_001",
  name: "Oficina Barranquilla Centro",
  city: "Barranquilla",
  region: "Caribe",
};

export const customer = {
  id: "cus_001",
  name: "Andres Perez",
  segment: "Persona natural",
  activeProducts: ["Tarjeta de credito"],
  preferredChannel: "WhatsApp",
  customerSince: "2024-03-12",
  commercialPropensity: "Interes medio en ahorro/inversion",
  riskAlerts: ["Requiere validacion para cambios de informacion laboral"],
  simulatedScore: 742,
  simulatedEligibility: "Elegible para orientacion comercial, no aprobacion automatica",
};

export const customers: CustomerProfile[] = [
  {
    ...customer,
    documentId: "1045678901",
    lastInteraction: "Consulta de extracto por WhatsApp hace 12 dias",
    recentRequests: ["Descarga de extracto", "Actualizacion de direccion", "Consulta sobre CDT"],
    softInsights: [
      "Cliente usa WhatsApp como canal preferido; conviene entregar pasos resumidos.",
      "Tiene tarjeta activa y ha preguntado por CDT, oportunidad de orientacion sin recomendacion definitiva.",
      "Si solicita cambio de ingresos, validar soporte antes de confirmar el tramite.",
    ],
  },
  {
    id: "cus_002",
    documentId: "80200111",
    name: "Maria Fernanda Lopez",
    segment: "Persona natural - pensionada",
    activeProducts: ["CliCuenta", "CDT"],
    preferredChannel: "Oficina",
    customerSince: "2021-09-08",
    commercialPropensity: "Bajo interes en productos nuevos; alto interes en servicio",
    riskAlerts: ["Prefiere atencion presencial para cambios de datos"],
    simulatedScore: 701,
    simulatedEligibility: "Elegible para orientacion de canales digitales, no venta proactiva",
    lastInteraction: "Renovacion de CDT hace 28 dias",
    recentRequests: ["Renovacion CDT", "Consulta de tasas", "Actualizacion de telefono"],
    softInsights: [
      "Priorizar claridad y confirmacion paso a paso.",
      "Puede requerir apoyo para migrar consultas simples a canales digitales.",
      "Evitar lenguaje tecnico sobre rentabilidad; ofrecer simulacion formal.",
    ],
  },
  {
    id: "cus_003",
    documentId: "1098765432",
    name: "Julian Torres",
    segment: "Independiente",
    activeProducts: ["Tarjeta de credito"],
    preferredChannel: "App",
    customerSince: "2023-01-19",
    commercialPropensity: "Interes medio en financiacion y pagos digitales",
    riskAlerts: ["Ingresos variables; cambios laborales requieren soporte"],
    simulatedScore: 688,
    simulatedEligibility: "Elegible para educacion financiera y orientacion de pagos",
    lastInteraction: "Bloqueo de acceso app hace 5 dias",
    recentRequests: ["Recuperacion de app", "Consulta pago minimo", "Actualizacion de ingresos"],
    softInsights: [
      "Tiene friccion reciente con app; verificar si puede operar por canal digital.",
      "Si pregunta por ingresos, validar soportes para independiente.",
      "Puede beneficiarse de guia de pagos y extractos.",
    ],
  },
];

export const transcript: TranscriptLine[] = [
  {
    speaker: "Cliente",
    text: "Buenos dias. Quiero actualizar unos datos porque cambie de direccion y tambien cambiaron mis ingresos. Me dijeron que tal vez eso se puede hacer por WhatsApp.",
  },
  {
    speaker: "Asesor",
    text: "Claro, revisemos que tipo de datos necesitas actualizar.",
  },
  {
    speaker: "Cliente",
    text: "Entonces, puedo actualizar mi direccion y mis ingresos por WhatsApp?",
  },
  {
    speaker: "Asesor",
    text: "Validemos el proceso para darte una respuesta correcta.",
  },
  {
    speaker: "Cliente",
    text: "Ya que estoy aqui, tengo 5 millones guardados y quisiera saber que opcion tengo para invertirlos sin moverlos todos los dias.",
  },
  {
    speaker: "Cliente",
    text: "Y si soy independiente y no tengo certificado laboral, que soporte me aceptan para actualizar ingresos?",
  },
];

export const detectedQuestions: DetectedQuestion[] = [
  {
    id: "dq_001",
    intent: "ACTUALIZACION_DATOS",
    confidence: 0.91,
    fragment: "puedo actualizar mi direccion y mis ingresos por WhatsApp?",
    lineIndex: 2,
    topic: "Actualizacion de datos",
  },
  {
    id: "dq_002",
    intent: "CDT",
    confidence: 0.84,
    fragment: "tengo 5 millones guardados y quisiera saber que opcion tengo para invertirlos",
    lineIndex: 4,
    topic: "CDT / inversion",
  },
  {
    id: "dq_003",
    intent: "ACTUALIZACION_DATOS",
    confidence: 0.58,
    fragment: "si soy independiente y no tengo certificado laboral, que soporte me aceptan",
    lineIndex: 5,
    topic: "Actualizacion de ingresos independiente",
  },
];

export const answers: Record<string, StructuredAnswer> = {
  ACTUALIZACION_DATOS: {
    intent: "ACTUALIZACION_DATOS",
    summary:
      "La actualizacion depende del tipo de dato. Los datos de contacto pueden tener canales digitales habilitados, pero informacion laboral o ingresos puede requerir soporte y validacion.",
    script:
      "Senor Andres, podemos orientarlo con la actualizacion. Para datos simples como direccion o contacto se debe usar el canal habilitado por el banco. Para ingresos o informacion laboral, normalmente se requiere soporte documental o validacion adicional antes de completar el cambio.",
    checklist: [
      "Identificar si el dato es de contacto, direccion, laboral o financiero.",
      "Validar canal permitido para cada tipo de dato.",
      "Solicitar soporte si aplica.",
      "Escalar si la fuente no confirma el caso.",
    ],
    recommendedChannel: "Canal digital habilitado o atencion asistida segun tipo de dato.",
    requiredDocuments: ["Soporte documental para informacion laboral o ingresos, si aplica."],
    warnings: ["No confirmar actualizacion de ingresos sin soporte o fuente aprobada."],
    nextBestAction:
      "Guiar la actualizacion de datos simples por canal permitido y validar soporte para ingresos antes de continuar.",
    sources: [
      {
        id: "02_actualizacion_datos_procesos",
        label: "Actualizacion de datos - procesos",
        type: "pdf",
      },
    ],
  },
  CDT: {
    intent: "CDT",
    summary:
      "El CDT puede ser una opcion de ahorro/inversion a plazo fijo. La rentabilidad depende del monto, plazo y tasa vigente.",
    script:
      "Con ese monto podemos revisar una alternativa como CDT. Es importante simularlo con la tasa vigente y el plazo que prefieras antes de tomar una decision. Puedo orientarte para hacer la simulacion o indicarte el canal digital correspondiente.",
    checklist: [
      "Confirmar monto aproximado.",
      "Preguntar plazo deseado.",
      "Explicar que tasa y condiciones pueden variar.",
      "No prometer rentabilidad sin simulacion vigente.",
      "Ofrecer simulacion o acompanamiento.",
    ],
    recommendedChannel: "Simulacion o canal digital habilitado para CDT.",
    requiredDocuments: [],
    warnings: ["No presentar como recomendacion financiera definitiva. Validar tasas vigentes."],
    nextBestAction: "Ofrecer simulacion CDT con monto y plazo, y registrar oportunidad de adquisicion asistida.",
    sources: [
      {
        id: "03_cdt_caracteristicas_beneficios",
        label: "CDT - caracteristicas y beneficios",
        type: "pdf",
      },
    ],
  },
};

export const marketingMarkdown = `# Reporte Diario De Oportunidades De Contenido

Fecha: 2026-05-24
Fuente: interacciones agregadas de oficina presencial

## Resumen Ejecutivo

La principal friccion del dia fue actualizacion de datos, especialmente diferencias entre datos de contacto, direccion e informacion laboral.

## Oportunidad Prioritaria

### Actualizacion De Datos Personales Y Laborales

- Evidencia: consultas repetidas en sede Barranquilla Centro.
- Estado web: contenido incompleto.
- Recomendacion: crear FAQ clara sobre tipos de datos, canales y soportes.
- Fuentes: documento de actualizacion de datos + indice web precargado.
- Revision humana requerida: si.

## Tareas Sugeridas

1. Validar reglas con operaciones.
2. Actualizar FAQ publica.
3. Reforzar onboarding de asesores nuevos.
`;
