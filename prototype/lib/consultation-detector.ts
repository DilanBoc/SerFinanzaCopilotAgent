import type { DetectedQuestion, Intent } from "./types";

const intentRules: Array<{
  intent: Intent;
  topic: string;
  confidence: number;
  keywords: string[];
}> = [
  {
    intent: "ACTUALIZACION_DATOS",
    topic: "Actualizacion de datos",
    confidence: 0.82,
    keywords: ["actualizar", "datos", "direccion", "ingresos", "independiente", "soporte"],
  },
  {
    intent: "CDT",
    topic: "CDT / inversion",
    confidence: 0.8,
    keywords: ["cdt", "invertir", "inversion", "ahorro", "tasa", "plazo", "millones"],
  },
];

const questionSignals = [
  "como",
  "puedo",
  "necesito",
  "quiero",
  "quisiera",
  "que",
  "cual",
  "donde",
  "me aceptan",
  "opcion",
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function detectConsultation(text: string, lineIndex: number): DetectedQuestion | null {
  const normalizedText = normalizeText(text);
  const hasQuestionSignal = questionSignals.some((signal) => normalizedText.includes(signal));
  const matchedRule = intentRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedText.includes(normalizeText(keyword))),
  );

  if (!hasQuestionSignal || !matchedRule) return null;

  return {
    id: `live_${Date.now()}_${lineIndex}`,
    intent: matchedRule.intent,
    confidence: matchedRule.confidence,
    fragment: text,
    lineIndex,
    topic: matchedRule.topic,
  };
}
