import postgres from "postgres";
import type { StudentModel, SafeguardAlert } from "../types";
import {
  type StoreDriver,
  type StoredStudent,
  type ClassRecord,
  DEFAULT_CLASS,
  buildSeed,
  newAlert,
  newStudent,
} from "./storeShared";

/**
 * Postgres driver — active when DATABASE_URL is set (Neon, Supabase, RDS, …).
 *
 * Student models and alerts are stored as JSONB: the nested trait/piece model
 * stays intact without an ORM, and we can move to normalised columns later
 * without changing the public store API. Schema is created lazily and
 * idempotently, so a fresh database needs no separate migration step.
 */

let sql: ReturnType<typeof postgres> | null = null;
let schemaReady: Promise<void> | null = null;

function db() {
  if (!sql) {
    // SSL: 'prefer' uses TLS when the server offers it (Neon/Supabase) and
    // falls back to plaintext when it doesn't (e.g. Railway's internal network).
    // Override with PGSSL=require / verify-full / disable as needed.
    const ssl =
      process.env.PGSSL === "disable"
        ? false
        : (process.env.PGSSL as "require" | "prefer" | "verify-full" | undefined) || "prefer";
    sql = postgres(process.env.DATABASE_URL!, {
      ssl,
      max: Number(process.env.PG_POOL_MAX || 5),
      idle_timeout: 20,
    });
  }
  return sql;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const s = db();
      await s`create table if not exists classes (
        id text primary key,
        name text not null,
        teacher_name text not null,
        student_ids jsonb not null default '[]'::jsonb
      )`;
      await s`create table if not exists students (
        id text primary key,
        class_id text not null,
        model jsonb not null
      )`;
      await s`create index if not exists students_class_idx on students (class_id)`;
      await s`create table if not exists alerts (
        id text primary key,
        class_id text not null,
        created_at bigint not null,
        acknowledged boolean not null default false,
        alert jsonb not null
      )`;
      await s`create index if not exists alerts_class_idx on alerts (class_id)`;
    })();
  }
  return schemaReady;
}

export const pgDriver: StoreDriver = {
  async seedIfEmpty() {
    await ensureSchema();
    const s = db();
    const [existing] = await s`select 1 from classes where id = ${DEFAULT_CLASS}`;
    if (existing) return;
    const { students, cls } = buildSeed();
    await s.begin(async (tx) => {
      await tx`insert into classes (id, name, teacher_name, student_ids)
        values (${cls.id}, ${cls.name}, ${cls.teacherName}, ${tx.json(cls.studentIds)})
        on conflict (id) do nothing`;
      for (const st of students) {
        await tx`insert into students (id, class_id, model)
          values (${st.studentId}, ${st.classId}, ${tx.json(st as never)})
          on conflict (id) do nothing`;
      }
    });
  },

  async getStudent(id) {
    await this.seedIfEmpty();
    const s = db();
    const [row] = await s`select model from students where id = ${id}`;
    return (row?.model as StoredStudent) || { ...newStudent(id, "Student"), classId: DEFAULT_CLASS };
  },

  async saveStudent(model: StudentModel, classId: string) {
    await this.seedIfEmpty();
    const s = db();
    const stored: StoredStudent = { ...model, classId };
    await s`insert into students (id, class_id, model)
      values (${stored.studentId}, ${classId}, ${s.json(stored as never)})
      on conflict (id) do update set class_id = excluded.class_id, model = excluded.model`;
    // Ensure the class roster includes this student.
    await s`update classes
      set student_ids = (
        select jsonb_agg(distinct e) from jsonb_array_elements(student_ids || ${s.json([stored.studentId] as never)}) e
      )
      where id = ${classId}`;
    return stored;
  },

  async getClass(classId) {
    await this.seedIfEmpty();
    const s = db();
    const [row] = await s`select id, name, teacher_name, student_ids from classes where id = ${classId}`;
    if (!row) return null;
    return {
      id: row.id as string,
      name: row.name as string,
      teacherName: row.teacher_name as string,
      studentIds: (row.student_ids as string[]) ?? [],
    };
  },

  async listClassStudents(classId) {
    await this.seedIfEmpty();
    const s = db();
    const rows = await s`select model from students where class_id = ${classId} order by id`;
    return rows.map((r) => r.model as StoredStudent);
  },

  async upsertStudentByExternalId(externalId, displayName, classId) {
    await this.seedIfEmpty();
    const s = db();
    const id = `ext_${externalId}`;
    const [row] = await s`select model from students where id = ${id}`;
    if (row) return row.model as StoredStudent;
    const stored: StoredStudent = { ...newStudent(id, displayName), classId };
    await this.saveStudent(stored, classId);
    return stored;
  },

  async addAlert(a) {
    await this.seedIfEmpty();
    const s = db();
    const alert = newAlert(a);
    await s`insert into alerts (id, class_id, created_at, acknowledged, alert)
      values (${alert.id}, ${alert.classId}, ${alert.createdAt}, ${alert.acknowledged}, ${s.json(alert as never)})`;
    return alert;
  },

  async listAlerts(classId) {
    await this.seedIfEmpty();
    const s = db();
    const rows = await s`select alert from alerts where class_id = ${classId} order by created_at desc`;
    return rows.map((r) => r.alert as SafeguardAlert);
  },

  async acknowledgeAlert(id, by) {
    await this.seedIfEmpty();
    const s = db();
    const [row] = await s`select alert from alerts where id = ${id}`;
    if (!row) return null;
    const alert = row.alert as SafeguardAlert;
    alert.acknowledged = true;
    alert.acknowledgedBy = by;
    alert.acknowledgedAt = Date.now();
    await s`update alerts set acknowledged = true, alert = ${s.json(alert as never)} where id = ${id}`;
    return alert;
  },
};
