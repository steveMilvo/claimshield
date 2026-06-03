import type { StudentModel, SafeguardAlert } from "../types";
import { jsonDriver } from "./storeJson";
import { DEFAULT_CLASS, type StoreDriver, type StoredStudent, type ClassRecord } from "./storeShared";

export type { StoredStudent, ClassRecord };

/**
 * Storage dispatcher. Uses Postgres when DATABASE_URL is set (production /
 * hosted), otherwise the zero-config JSON file driver (local dev). The public
 * API is async; everything above this file is storage-agnostic.
 *
 * The Postgres driver is imported lazily so local/dev builds never load the
 * `postgres` package or attempt a connection.
 */

let driverPromise: Promise<StoreDriver> | null = null;

function driver(): Promise<StoreDriver> {
  if (!driverPromise) {
    driverPromise = process.env.DATABASE_URL
      ? import("./storePg").then((m) => m.pgDriver)
      : Promise.resolve(jsonDriver);
  }
  return driverPromise;
}

export function defaultClassId(): string {
  return DEFAULT_CLASS;
}

export async function seedIfEmpty(): Promise<void> {
  return (await driver()).seedIfEmpty();
}

export async function getStudent(id: string): Promise<StoredStudent> {
  return (await driver()).getStudent(id);
}

export async function saveStudent(
  model: StudentModel,
  classId = DEFAULT_CLASS
): Promise<StoredStudent> {
  return (await driver()).saveStudent(model, classId);
}

export async function getClass(classId = DEFAULT_CLASS): Promise<ClassRecord | null> {
  return (await driver()).getClass(classId);
}

export async function listClassStudents(classId = DEFAULT_CLASS): Promise<StoredStudent[]> {
  return (await driver()).listClassStudents(classId);
}

export async function upsertStudentByExternalId(
  externalId: string,
  displayName: string,
  classId = DEFAULT_CLASS
): Promise<StoredStudent> {
  return (await driver()).upsertStudentByExternalId(externalId, displayName, classId);
}

export async function addAlert(
  a: Omit<SafeguardAlert, "id" | "createdAt" | "acknowledged">
): Promise<SafeguardAlert> {
  return (await driver()).addAlert(a);
}

export async function listAlerts(classId = DEFAULT_CLASS): Promise<SafeguardAlert[]> {
  return (await driver()).listAlerts(classId);
}

export async function acknowledgeAlert(id: string, by: string): Promise<SafeguardAlert | null> {
  return (await driver()).acknowledgeAlert(id, by);
}
