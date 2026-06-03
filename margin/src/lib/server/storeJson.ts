import fs from "node:fs";
import path from "node:path";
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
 * Local/zero-config driver: a single JSON file (no native deps, cross-platform).
 * Falls back to in-memory on a read-only filesystem (e.g. serverless) so the
 * app still runs. Used whenever DATABASE_URL is not set.
 */

interface DB {
  version: 1;
  students: Record<string, StoredStudent>;
  classes: Record<string, ClassRecord>;
  alerts: SafeguardAlert[];
}

const DATA_DIR = process.env.MARGIN_DATA_DIR || path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "margin-db.json");

let memory: DB | null = null;
let canWriteDisk = true;

function blankDB(): DB {
  return { version: 1, students: {}, classes: {}, alerts: [] };
}

function load(): DB {
  if (memory) return memory;
  try {
    memory = JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as DB;
    if (!memory.alerts) memory.alerts = [];
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
    canWriteDisk = false;
  }
}

function ensureSeed(): DB {
  const db = load();
  if (db.classes[DEFAULT_CLASS]) return db;
  const { students, cls } = buildSeed();
  for (const s of students) db.students[s.studentId] = s;
  db.classes[cls.id] = cls;
  persist(db);
  return db;
}

export const jsonDriver: StoreDriver = {
  async seedIfEmpty() {
    ensureSeed();
  },
  async getStudent(id) {
    const db = ensureSeed();
    return db.students[id] || { ...newStudent(id, "Student"), classId: DEFAULT_CLASS };
  },
  async saveStudent(model: StudentModel, classId: string) {
    const db = ensureSeed();
    const stored: StoredStudent = { ...model, classId };
    db.students[model.studentId] = stored;
    const cls = db.classes[classId];
    if (cls && !cls.studentIds.includes(model.studentId)) cls.studentIds.push(model.studentId);
    persist(db);
    return stored;
  },
  async getClass(classId) {
    const db = ensureSeed();
    return db.classes[classId] || null;
  },
  async listClassStudents(classId) {
    const db = ensureSeed();
    const cls = db.classes[classId];
    if (!cls) return [];
    return cls.studentIds.map((id) => db.students[id]).filter(Boolean);
  },
  async upsertStudentByExternalId(externalId, displayName, classId) {
    const db = ensureSeed();
    const id = `ext_${externalId}`;
    if (!db.students[id]) {
      db.students[id] = { ...newStudent(id, displayName), classId };
      db.classes[classId]?.studentIds.push(id);
      persist(db);
    }
    return db.students[id];
  },
  async addAlert(a) {
    const db = ensureSeed();
    const alert = newAlert(a);
    db.alerts.unshift(alert);
    persist(db);
    return alert;
  },
  async listAlerts(classId) {
    const db = ensureSeed();
    return db.alerts.filter((a) => a.classId === classId);
  },
  async acknowledgeAlert(id, by) {
    const db = ensureSeed();
    const alert = db.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.acknowledged = true;
    alert.acknowledgedBy = by;
    alert.acknowledgedAt = Date.now();
    persist(db);
    return alert;
  },
};
