import fs from "node:fs";
import path from "node:path";
import type { StudentModel, SafeguardAlert } from "../types";
import { newStudent } from "../studentModel";

/**
 * Server-side persistence — the canonical student-model store.
 *
 * Backed by a single JSON file (zero native deps, works on Windows/macOS/Linux
 * and in `next dev`). On a read-only/serverless filesystem it transparently
 * falls back to an in-memory store so the app still runs (non-persistent).
 *
 * This is the seam to a real database: swap `load`/`persist` for Postgres +
 * an event log in Phase 1. Everything above this file is storage-agnostic.
 */

export interface StoredStudent extends StudentModel {
  classId: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  teacherName: string;
  studentIds: string[];
}

interface DB {
  version: 1;
  students: Record<string, StoredStudent>;
  classes: Record<string, ClassRecord>;
  alerts: SafeguardAlert[];
}

const DATA_DIR = process.env.MARGIN_DATA_DIR || path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "margin-db.json");

const DEFAULT_CLASS = "cls_8e";
const SEED_STUDENTS = ["Maya P.", "Jordan L.", "Aisha R.", "Tom W.", "Noah K."];

let memory: DB | null = null; // in-memory fallback / cache
let canWriteDisk = true;

function blankDB(): DB {
  return { version: 1, students: {}, classes: {}, alerts: [] };
}

function load(): DB {
  if (memory) return memory;
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    memory = JSON.parse(raw) as DB;
    if (!memory.alerts) memory.alerts = []; // migrate older files
  } catch {
    memory = blankDB();
  }
  return memory;
}

function persist(db: DB) {
  memory = db;
  if (!canWriteDisk) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Read-only FS (e.g. serverless). Keep running from memory.
    canWriteDisk = false;
  }
}

export function seedIfEmpty(): DB {
  const db = load();
  if (db.classes[DEFAULT_CLASS]) return db;

  const studentIds: string[] = [];
  SEED_STUDENTS.forEach((name, i) => {
    const id = `stu_${i + 1}`;
    db.students[id] = { ...newStudent(id, name), classId: DEFAULT_CLASS };
    studentIds.push(id);
  });
  db.classes[DEFAULT_CLASS] = {
    id: DEFAULT_CLASS,
    name: "8E English",
    teacherName: "Ms Cole",
    studentIds,
  };
  persist(db);
  return db;
}

export function getStudent(id: string): StoredStudent {
  const db = seedIfEmpty();
  return (
    db.students[id] || { ...newStudent(id, "Student"), classId: DEFAULT_CLASS }
  );
}

export function saveStudent(model: StudentModel, classId = DEFAULT_CLASS): StoredStudent {
  const db = seedIfEmpty();
  const stored: StoredStudent = { ...model, classId };
  db.students[model.studentId] = stored;
  const cls = db.classes[classId];
  if (cls && !cls.studentIds.includes(model.studentId)) {
    cls.studentIds.push(model.studentId);
  }
  persist(db);
  return stored;
}

export function getClass(classId = DEFAULT_CLASS): ClassRecord | null {
  const db = seedIfEmpty();
  return db.classes[classId] || null;
}

export function listClassStudents(classId = DEFAULT_CLASS): StoredStudent[] {
  const db = seedIfEmpty();
  const cls = db.classes[classId];
  if (!cls) return [];
  return cls.studentIds.map((id) => db.students[id]).filter(Boolean);
}

export function defaultClassId(): string {
  return DEFAULT_CLASS;
}

/* ----------------------------- Safeguarding ----------------------------- */

export function addAlert(
  a: Omit<SafeguardAlert, "id" | "createdAt" | "acknowledged">
): SafeguardAlert {
  const db = seedIfEmpty();
  const alert: SafeguardAlert = {
    ...a,
    id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    acknowledged: false,
  };
  db.alerts.unshift(alert);
  persist(db);
  return alert;
}

export function listAlerts(classId = DEFAULT_CLASS): SafeguardAlert[] {
  const db = seedIfEmpty();
  return db.alerts.filter((a) => a.classId === classId);
}

export function acknowledgeAlert(id: string, by: string): SafeguardAlert | null {
  const db = seedIfEmpty();
  const alert = db.alerts.find((a) => a.id === id);
  if (!alert) return null;
  alert.acknowledged = true;
  alert.acknowledgedBy = by;
  alert.acknowledgedAt = Date.now();
  persist(db);
  return alert;
}

/** Find or create a student by external identity (e.g. Google sub/email). */
export function upsertStudentByExternalId(
  externalId: string,
  displayName: string,
  classId = DEFAULT_CLASS
): StoredStudent {
  const db = seedIfEmpty();
  const id = `ext_${externalId}`;
  if (!db.students[id]) {
    db.students[id] = { ...newStudent(id, displayName), classId };
    const cls = db.classes[classId];
    if (cls) cls.studentIds.push(id);
    persist(db);
  }
  return db.students[id];
}
