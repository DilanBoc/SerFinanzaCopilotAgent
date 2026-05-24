export type Intent = "ACTUALIZACION_DATOS" | "CDT";

export type AdvisorAction = "KNOW" | "VIEW_ANSWER" | "ESCALATE" | "IGNORE";

export type StructuredAnswer = {
  intent: Intent;
  summary: string;
  script: string;
  checklist: string[];
  recommendedChannel: string;
  requiredDocuments: string[];
  warnings: string[];
  nextBestAction: string;
  sources: { id: string; label: string; type: "pdf" | "web" }[];
};

export type DetectedQuestion = {
  id: string;
  intent: Intent;
  confidence: number;
  fragment: string;
  lineIndex: number;
  topic: string;
};

export type TranscriptLine = {
  speaker: "Cliente" | "Asesor";
  text: string;
};

export type CustomerProfile = {
  id: string;
  documentId: string;
  name: string;
  segment: string;
  activeProducts: string[];
  preferredChannel: string;
  customerSince: string;
  commercialPropensity: string;
  riskAlerts: string[];
  simulatedScore: number;
  simulatedEligibility: string;
  lastInteraction: string;
  recentRequests: string[];
  softInsights: string[];
};
