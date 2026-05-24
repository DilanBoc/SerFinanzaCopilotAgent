import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { advisor, customer, customers, marketingMarkdown, office } from "./demo-data";

const dataDir = path.join(process.cwd(), "data");
const reportsDir = path.join(process.cwd(), "generated", "reports");
const dbPath = path.join(dataDir, "action-hub.sqlite");

let db: DatabaseSync | null = null;

export function getDb() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });
  if (!db) {
    db = new DatabaseSync(dbPath);
    ensureCompatibleSchema(db);
    initialize(db);
  }
  return db;
}

function ensureCompatibleSchema(database: DatabaseSync) {
  const table = database
    .prepare("select name from sqlite_master where type = 'table' and name = 'customers_dummy'")
    .get();
  if (!table) return;
  const columns = database.prepare("pragma table_info(customers_dummy)").all() as Array<{ name: string }>;
  const hasDocumentId = columns.some((column) => column.name === "document_id");
  if (!hasDocumentId) {
    database.exec(`
      drop table if exists daily_reports;
      drop table if exists marketing_opportunities;
      drop table if exists knowledge_gaps;
      drop table if exists interaction_events;
      drop table if exists attention_sessions;
      drop table if exists customers_dummy;
      drop table if exists advisors;
      drop table if exists offices;
    `);
  }
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
      document_id text unique,
      name text not null,
      segment text not null,
      active_products text not null,
      preferred_channel text not null,
      customer_since text not null,
      commercial_propensity text not null,
      risk_alerts text not null,
      simulated_score integer,
      simulated_eligibility text not null,
      last_interaction text,
      recent_requests text,
      soft_insights text
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

  const offices = [
    { id: "off_001", name: "Oficina Barranquilla Centro", city: "Barranquilla", region: "Caribe" },
    { id: "off_002", name: "Oficina Bogota Norte", city: "Bogota", region: "Andina" },
    { id: "off_003", name: "Oficina Cartagena Bocagrande", city: "Cartagena", region: "Caribe" },
    { id: "off_004", name: "Oficina Medell El Poblado", city: "Medellin", region: "Andina" },
    { id: "off_005", name: "Oficina Cali Chipichape", city: "Cali", region: "Pacifico" },
  ];
  const advisors = [
    { id: "adv_001", officeId: "off_001", name: "Laura Martinez", team: "Atencion presencial", seniority: "Asesora nueva" },
    { id: "adv_002", officeId: "off_001", name: "Camilo Ortega", team: "Atencion presencial", seniority: "Sénior" },
    { id: "adv_003", officeId: "off_002", name: "Natalia Ruiz", team: "Ventas", seniority: "Sénior" },
    { id: "adv_004", officeId: "off_003", name: "Pedro Suarez", team: "Servicio", seniority: "Asesor nuevo" },
    { id: "adv_005", officeId: "off_004", name: "Elena Gomez", team: "Atencion presencial", seniority: "Sénior" },
    { id: "adv_006", officeId: "off_005", name: "Ricardo Luna", team: "Ventas", seniority: "Sénior" },
  ];

  const officeInsert = database.prepare("insert into offices (id, name, city, region) values (?, ?, ?, ?)");
  for (const o of offices) {
    const exists = database.prepare("select id from offices where id = ?").get(o.id);
    if (!exists) officeInsert.run(o.id, o.name, o.city, o.region);
  }

  const advisorInsert = database.prepare("insert into advisors (id, name, office_id, team, seniority) values (?, ?, ?, ?, ?)");
  for (const a of advisors) {
    const exists = database.prepare("select id from advisors where id = ?").get(a.id);
    if (!exists) advisorInsert.run(a.id, a.name, a.officeId, a.team, a.seniority);
  }
  const customerInsert = database.prepare(
    `insert into customers_dummy
     (id, document_id, name, segment, active_products, preferred_channel, customer_since, commercial_propensity, risk_alerts, simulated_score, simulated_eligibility, last_interaction, recent_requests, soft_insights)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const item of customers) {
    customerInsert.run(
      item.id,
      item.documentId,
      item.name,
      item.segment,
      JSON.stringify(item.activeProducts),
      item.preferredChannel,
      item.customerSince,
      item.commercialPropensity,
      JSON.stringify(item.riskAlerts),
      item.simulatedScore,
      item.simulatedEligibility,
      item.lastInteraction,
      JSON.stringify(item.recentRequests),
      JSON.stringify(item.softInsights),
    );
  }

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

  seedOperationalHistory(database);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function seedOperationalHistory(database: DatabaseSync) {
  const sessions = database.prepare("select count(*) as count from attention_sessions").get() as { count: number };
  if (sessions.count > 0) return;

  const offices = [
    { id: "off_001", name: "Oficina Barranquilla Centro" },
    { id: "off_002", name: "Oficina Bogota Norte" },
    { id: "off_003", name: "Oficina Cartagena Bocagrande" },
    { id: "off_004", name: "Oficina Medell El Poblado" },
    { id: "off_005", name: "Oficina Cali Chipichape" },
  ];
  const advisors = [
    { id: "adv_001", name: "Laura Martinez" },
    { id: "adv_002", name: "Camilo Ortega" },
    { id: "adv_003", name: "Natalia Ruiz" },
    { id: "adv_004", name: "Pedro Suarez" },
    { id: "adv_005", name: "Elena Gomez" },
    { id: "adv_006", name: "Ricardo Luna" },
  ];
  const topics = [
    { intent: "ACTUALIZACION_DATOS", topic: "Actualizacion de datos", product: "Datos cliente", weight: 4 },
    { intent: "CDT", topic: "CDT / inversion", product: "CDT", weight: 3 },
    { intent: "APP_REGISTRO", topic: "Registro app", product: "App", weight: 2 },
    { intent: "EXTRACTO", topic: "Extractos", product: "Tarjeta", weight: 2 },
  ];
  const buttons = ["VIEW_ASSISTANCE", "CLOSE", "ESCALATE"];

  for (let day = 29; day >= 0; day--) {
    const dailyVolume = 4 + (day < 7 ? 4 : 0);
    for (let i = 0; i < dailyVolume; i++) {
      const officeItem = offices[(day + i) % offices.length];
      const advisorItem = advisors[(day + i) % advisors.length];
      const topic = topics[(day + i) % topics.length];
      const sessionId = `seed_ses_${day}_${i}`;
      database
        .prepare(
          `insert into attention_sessions
           (id, advisor_id, customer_id, office_id, started_at, consent_notice_shown, transcript_text)
           values (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(sessionId, advisorItem.id, "cus_001", officeItem.id, daysAgo(day), 1, `Seed transcript ${topic.topic}`);

      database
        .prepare(
          `insert into interaction_events
           (id, session_id, timestamp, event_type, detected_intent, confidence_score, button_selected, source_ids, payload_json)
           values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          `seed_evt_detect_${day}_${i}`,
          sessionId,
          daysAgo(day),
          "QUESTION_DETECTED",
          topic.intent,
          0.74 + ((i % 3) * 0.06),
          null,
          JSON.stringify([topic.intent === "CDT" ? "03_cdt_caracteristicas_beneficios" : "02_actualizacion_datos_procesos"]),
          JSON.stringify({ trigger: `Consulta seed sobre ${topic.topic}`, product: topic.product, office: officeItem.name }),
        );

      const button = buttons[(day + i) % buttons.length];
      database
        .prepare(
          `insert into interaction_events
           (id, session_id, timestamp, event_type, detected_intent, confidence_score, button_selected, source_ids, payload_json)
           values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          `seed_evt_button_${day}_${i}`,
          sessionId,
          daysAgo(day),
          "BUTTON_SELECTED",
          topic.intent,
          null,
          button,
          null,
          JSON.stringify({ topic: topic.topic, advisor: advisorItem.name, office: officeItem.name }),
        );

      if (button === "ESCALATE" || (topic.intent === "ACTUALIZACION_DATOS" && i % 3 === 0)) {
        const gapId = `seed_gap_${day}_${i}`;
        database
          .prepare(
            `insert into knowledge_gaps
             (id, session_id, advisor_id, office_id, intent, topic, question_text, source_ids, status, frequency_key, created_at)
             values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            gapId,
            sessionId,
            advisorItem.id,
            officeItem.id,
            topic.intent,
            topic.topic,
            `Pregunta recurrente sobre ${topic.topic}`,
            JSON.stringify([topic.intent === "CDT" ? "03_cdt_caracteristicas_beneficios" : "02_actualizacion_datos_procesos"]),
            day % 5 === 0 ? "en_revision" : "pendiente",
            `${topic.intent}:${topic.topic}`,
            daysAgo(day),
          );
      }
    }
  }

  const moreOpportunities = [
    ["CDT para clientes con monto definido", 18, 79, "contenido existente", "Mejorar CTA de simulacion CDT por monto y plazo.", ["03_cdt_caracteristicas_beneficios", "indice_web_cdt"]],
    ["Recuperacion y registro en app", 15, 72, "contenido incompleto", "Crear guia corta para asesores sobre recuperacion de acceso y registro app.", ["04_registro_app_serfinanza"]],
    ["Lectura de extractos de tarjeta", 11, 68, "contenido ausente", "Crear FAQ sobre pago minimo, pago total y fechas de corte.", ["05_extracto_credito_canales"]],
  ] as const;

  for (const [topic, frequency, score, status, recommendation, sources] of moreOpportunities) {
    database
      .prepare(
        `insert into marketing_opportunities
         (id, topic, frequency, impact_score, web_content_status, recommendation, sources, created_at)
         values (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(`mkt_${randomUUID()}`, topic, frequency, score, status, recommendation, JSON.stringify(sources), new Date().toISOString());
  }
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

export function findCustomerByDocument(documentId: string) {
  const row = getDb()
    .prepare("select * from customers_dummy where document_id = ?")
    .get(documentId) as any;
  if (!row) return null;
  return {
    id: row.id,
    documentId: row.document_id,
    name: row.name,
    segment: row.segment,
    activeProducts: JSON.parse(row.active_products),
    preferredChannel: row.preferred_channel,
    customerSince: row.customer_since,
    commercialPropensity: row.commercial_propensity,
    riskAlerts: JSON.parse(row.risk_alerts),
    simulatedScore: row.simulated_score,
    simulatedEligibility: row.simulated_eligibility,
    lastInteraction: row.last_interaction,
    recentRequests: JSON.parse(row.recent_requests ?? "[]"),
    softInsights: JSON.parse(row.soft_insights ?? "[]"),
  };
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
  const detected = events.filter((event: any) => event.event_type === "QUESTION_DETECTED");
  const support = events.filter((event: any) => event.button_selected === "VIEW_ASSISTANCE" || event.button_selected === "VIEW_ANSWER");
  const closed = events.filter((event: any) => event.button_selected === "CLOSE" || event.button_selected === "KNOW");
  const escalations = events.filter((event: any) => event.button_selected === "ESCALATE");
  return {
    kpis: {
      detected: detected.length,
      knows: closed.length,
      support: support.length,
      escalations: escalations.length,
      gaps: gaps.length || 1,
    },
    trend: {
      cdtWeeklyGrowth: 40,
      topRisingTopic: "CDT / inversion",
      mainTrainingNeed: "Actualizacion de datos e ingresos de independientes",
    },
    byTopic: [
      { topic: "Actualizacion de datos", support: 31, knows: 17, gaps: gaps.filter((gap: any) => gap.intent === "ACTUALIZACION_DATOS").length },
      { topic: "CDT / inversion", support: 24, knows: 19, gaps: gaps.filter((gap: any) => gap.intent === "CDT").length },
      { topic: "Registro app", support: 16, knows: 21, gaps: gaps.filter((gap: any) => gap.intent === "APP_REGISTRO").length },
      { topic: "Extractos", support: 12, knows: 18, gaps: gaps.filter((gap: any) => gap.intent === "EXTRACTO").length },
    ],
    byOffice: [
      { office: "Barranquilla Centro", support: 39, gaps: gaps.filter((gap: any) => gap.office_id === "off_001").length },
      { office: "Bogota Norte", support: 28, gaps: gaps.filter((gap: any) => gap.office_id === "off_002").length },
      { office: "Cartagena Bocagrande", support: 21, gaps: gaps.filter((gap: any) => gap.office_id === "off_003").length },
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
