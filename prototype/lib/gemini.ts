import { marketingMarkdown } from "./demo-data";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function generateMarketingMarkdownWithGemini(input: {
  opportunities: unknown[];
  fallback?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return input.fallback ?? marketingMarkdown;

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = [
    "Eres un analista de conocimiento bancario.",
    "Genera un reporte Markdown claro para humanos y modelos de IA.",
    "No incluyas transcripciones. Usa solo evidencia agregada.",
    "Incluye metadata, resumen ejecutivo, patrones, oportunidades, comparacion contra indice web, fuentes, revision humana requerida y tareas sugeridas.",
    "Datos:",
    JSON.stringify(input.opportunities, null, 2),
  ].join("\n\n");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) return input.fallback ?? marketingMarkdown;

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
    return text || input.fallback || marketingMarkdown;
  } catch {
    return input.fallback ?? marketingMarkdown;
  }
}
