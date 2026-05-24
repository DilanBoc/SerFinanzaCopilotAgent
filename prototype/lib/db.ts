import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { advisor, customer, marketingMarkdown, office } from "./demo-data";

const dataDir = path.join(process.cwd(), "data");
const reportsDir = path.join(process.cwd(), "generated", "reports");
const dbPath = path.join(dataDir, "action-hub.sqlite");

let db: DatabaseSync | null = null;

export function getDb() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });
  if (!db) {
    db = new DatabaseSync(dbPath);
    initialize(db);
  }
  return db;
}

function initialize(database: DatabaseSync) {
  database.exec(`
    create table if not exists advisors (
      id text primary key,
      name text not null,
      office_id text not null,
      team text not null,
      seniority text not null
    );
    create table if not exists offices (
      id text primary key,
      name text not null,
      city text not null,
      region text not null
    );
    create table if not exists customers_dummy (
      id text primary key,
      name text not null,
      segment text not null,
      active_products text not null,
      preferred_channel text not null,
      customer_since text not null,
      commercial_propensity text not null,
      risk_alerts text not null,
      simulated_score integer,
      simulated_eligibility text not null
    );
    create table if not exists attention_sessions (
      id text primary key,
      advisor_id text not null,
      customer_id text not null,
      office_id text not null,
      started_at text not null,
      ended_at text,
      consent_notice_shown integer not null,
      transcript_text text not null
    );
    create table if not exists interaction_events (
      id text primary key,
      session_id text not null,
      timestamp text not null,
      event_type text not null,
      detected_intent text,
      confidence_score real,
      button_selected text,
      source_ids text,
      payload_json text
    );
    create table if not exists knowledge_gaps (
      id text primary key,
      session_id text not null,
      advisor_id text not null,
      office_id text not null,
      intent text not null,
      topic text not null,
      question_text text not null,
      source_ids text,
      status text not null,
      frequency_key text not null,
      created_at text not null
    );
    create table if not exists marketing_opportunities (
      id text primary key,
      topic text not null,
      frequency integer not null,
      impact_score integer not null,
      web_content_status text not null,
      recommendation text not null,
      sources text not null,
      created_at text not null
    );
    create table if not exists daily_reports (
      id text primary key,
      report_type text not null,
      date text not null,
      file_path text not null,
      created_at text not null
    );
  `);
  seed(database);
}

function seed(database: DatabaseSync) {
  const advisorCount = database.prepare("select count(*) as count from advisors").get() as { count: number };
  if (advisorCount.count > 0) return;

  database
    .prepare("insert into offices (id, name, city, region) values (?, ?, ?, ?)")
    .run(office.id, office.name, office.city, office.region);
  database
    .prepare("insert into advisors (id, name, office_id, team, seniority) values (?, ?, ?, ?, ?)")
    .run(advisor.id, advisor.name, advisor.officeId, advisor.team, advisor.seniority);
  database
    .prepare(
      `insert into customers_dummy
       (id, name, segment, active_products, preferred_channel, customer_since, commercial_propensity, risk_alerts, simulated_score, simulated_eligibility)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      customer.id,
      customer.name,
      customer.segment,
      JSON.stringify(customer.activeProducts),
      customer.preferredChannel,
      customer.customerSince,
      customer.commercialPropensity,
      JSON.stringify(customer.riskAlerts),
      customer.simulatedScore,
      customer.simulatedEligibility,
    );

  database
    .prepare(
      `insert into marketing_opportunities
       (id, topic, frequency, impact_score, web_content_status, recommendation, sources, created_at)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      "mkt_001",
      "Actualizacion de datos personales y laborales",
      12,
      86,
      "contenido incompleto",
      "Crear FAQ clara sobre tipos de datos, canales y soportes. Requiere revision humana.",
      JSON.stringify(["02_actualizacion_datos_procesos", "indice_web_actualizacion_datos"]),
      new Date().toISOString(),
    );
}

export function createSession(transcriptText: string) {
  const database = getDb();
  const id = `ses_${randomUUID()}`;
  database
    .prepare(
      `insert into attention_sessions
       (id, advisor_id, customer_id, office_id, started_at, consent_notice_shown, transcript_text)
       values (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, advisor.id, customer.id, office.id, new Date().toISOString(), 1, transcriptText);
  recordEvent(id, "SESSION_STARTED", { advisorId: advisor.id, customerId: customer.id, officeId: office.id });
  recordEvent(id, "CONSENT_NOTICE_SHOWN", { method: "physical_notice" });
  return id;
}

export function recordEvent(
  sessionId: string,
  eventType: string,
  payload: Record<string, unknown> = {},
  options: { intent?: string; confidence?: number; button?: string; sourceIds?: string[] } = {},
) {
  const database = getDb();
  const id = `evt_${randomUUID()}`;
  database
    .prepare(
      `insert into interaction_events
       (id, session_id, timestamp, event_type, detected_intent, confidence_score, button_selected, source_ids, payload_json)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      sessionId,
      new Date().toISOString(),
      eventType,
      options.intent ?? null,
      options.confidence ?? null,
      options.button ?? null,
      options.sourceIds ? JSON.stringify(options.sourceIds) : null,
      JSON.stringify(payload),
    );
  return id;
}

export function createGap(input: {
  sessionId: string;
  intent: string;
  topic: string;
  questionText: string;
  sourceIds: string[];
}) {
  const database = getDb();
  const id = `gap_${randomUUID()}`;
  database
    .prepare(
      `insert into knowledge_gaps
       (id, session_id, advisor_id, office_id, intent, topic, question_text, source_ids, status, frequency_key, created_at)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.sessionId,
      advisor.id,
      office.id,
      input.intent,
      input.topic,
      input.questionText,
      JSON.stringify(input.sourceIds),
      "pendiente",
      `${input.intent}:${input.topic}`,
      new Date().toISOString(),
    );
  recordEvent(
    input.sessionId,
    "GAP_CREATED",
    { gapId: id, topic: input.topic, questionText: input.questionText },
    { intent: input.intent, sourceIds: input.sourceIds },
  );
  return id;
}

export function listGaps() {
  const database = getDb();
  return database.prepare("select * from knowledge_gaps order by created_at desc").all();
}

export function updateGapStatus(id: string, status: string) {
  const database = getDb();
  database.prepare("update knowledge_gaps set status = ? where id = ?").run(status, id);
}

export function getQualityDashboard() {
  const database = getDb();
  const events = database.prepare("select * from interaction_events order by timestamp desc").all();
  const gaps = database.prepare("select * from knowledge_gaps order by created_at desc").all();
  return {
    kpis: {
      detected: events.filter((event: any) => event.event_type === "QUESTION_DETECTED").length || 9,
      knows: events.filter((event: any) => event.button_selected === "KNOW").length || 5,
      support: events.filter((event: any) => event.button_selected === "VIEW_ANSWER").length || 3,
      escalations: events.filter((event: any) => event.button_selected === "ESCALATE").length || 1,
      gaps: gaps.length || 1,
    },
    byTopic: [
      { topic: "Actualizacion de datos", support: 8, knows: 4, gaps: gaps.length || 1 },
      { topic: "CDT / inversion", support: 5, knows: 6, gaps: 0 },
      { topic: "Registro app", support: 3, knows: 7, gaps: 0 },
    ],
    byOffice: [
      { office: "Barranquilla Centro", support: 11, gaps: gaps.length || 1 },
      { office: "Bogota Norte", support: 7, gaps: 0 },
      { office: "Cartagena Bocagrande", support: 4, gaps: 0 },
    ],
    advisorFocus: {
      advisor: advisor.name,
      office: office.name,
      recommendation: "Reforzar actualizacion de ingresos y soportes para independientes.",
    },
  };
}

export function listMarketingOpportunities() {
  return getDb().prepare("select * from marketing_opportunities order by impact_score desc").all();
}

export function saveMarketingReport(content = marketingMarkdown) {
  const database = getDb();
  const fileName = `marketing-${new Date().toISOString().slice(0, 10)}.md`;
  const filePath = path.join(reportsDir, fileName);
  require("node:fs").writeFileSync(filePath, content, "utf8");
  const id = `rep_${randomUUID()}`;
  database
    .prepare("insert into daily_reports (id, report_type, date, file_path, created_at) values (?, ?, ?, ?, ?)")
    .run(id, "marketing", new Date().toISOString().slice(0, 10), filePath, new Date().toISOString());
  return { id, filePath, content };
}
