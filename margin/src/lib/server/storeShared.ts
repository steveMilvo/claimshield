import type { StudentModel, SafeguardAlert } from "../types";
import { newStudent } from "../studentModel";

/** Shared shapes, constants and seed data for both store drivers. */

export interface StoredStudent extends StudentModel {
  classId: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  teacherName: string;
  studentIds: string[];
}

export const DEFAULT_CLASS = "cls_8e";
export const SEED_STUDENTS = ["Maya P.", "Jordan L.", "Aisha R.", "Tom W.", "Noah K."];
export const SEED_TEACHER = "Ms Cole";
export const SEED_CLASS_NAME = "8E English";

/** The initial class roster used to seed an empty store. */
export function buildSeed(): { students: StoredStudent[]; cls: ClassRecord } {
  const students: StoredStudent[] = SEED_STUDENTS.map((name, i) => ({
    ...newStudent(`stu_${i + 1}`, name),
    classId: DEFAULT_CLASS,
  }));
  const cls: ClassRecord = {
    id: DEFAULT_CLASS,
    name: SEED_CLASS_NAME,
    teacherName: SEED_TEACHER,
    studentIds: students.map((s) => s.studentId),
  };
  return { students, cls };
}

export function newAlert(
  a: Omit<SafeguardAlert, "id" | "createdAt" | "acknowledged">
): SafeguardAlert {
  return {
    ...a,
    id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    acknowledged: false,
  };
}

/** Async storage interface implemented by the JSON and Postgres drivers. */
export interface StoreDriver {
  seedIfEmpty(): Promise<void>;
  getStudent(id: string): Promise<StoredStudent>;
  saveStudent(model: StudentModel, classId: string): Promise<StoredStudent>;
  getClass(classId: string): Promise<ClassRecord | null>;
  listClassStudents(classId: string): Promise<StoredStudent[]>;
  upsertStudentByExternalId(externalId: string, displayName: string, classId: string): Promise<StoredStudent>;
  addAlert(a: Omit<SafeguardAlert, "id" | "createdAt" | "acknowledged">): Promise<SafeguardAlert>;
  listAlerts(classId: string): Promise<SafeguardAlert[]>;
  acknowledgeAlert(id: string, by: string): Promise<SafeguardAlert | null>;
}

export { newStudent };
