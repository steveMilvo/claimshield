"use client";

import type { StudentModel } from "./types";
import { newStudent } from "./studentModel";

/**
 * MVP persistence: a class of student models in localStorage. This stands in
 * for the server-side student-model store described in the architecture; it
 * lets the full loop + teacher dashboard work end-to-end without a database.
 * Swap for a real DB (per-student rows + event log) in Phase 1.
 */

const KEY = "margin.class.v1";
const ACTIVE = "margin.activeStudent.v1";

export interface ClassStore {
  students: Record<string, StudentModel>;
}

function read(): ClassStore {
  if (typeof window === "undefined") return { students: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ClassStore;
  } catch {
    /* ignore */
  }
  return { students: {} };
}

function write(store: ClassStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function seedClassIfEmpty() {
  const store = read();
  if (Object.keys(store.students).length > 0) return;
  const seed = ["Maya P.", "Jordan L.", "Aisha R.", "Tom W.", "Noah K."];
  for (let i = 0; i < seed.length; i++) {
    const id = `stu_${i + 1}`;
    store.students[id] = newStudent(id, seed[i]);
  }
  write(store);
  if (!localStorage.getItem(ACTIVE)) localStorage.setItem(ACTIVE, "stu_1");
}

export function getClass(): ClassStore {
  return read();
}

export function getStudent(id: string): StudentModel {
  const store = read();
  return store.students[id] || newStudent(id, "Student");
}

export function saveStudent(m: StudentModel) {
  const store = read();
  store.students[m.studentId] = m;
  write(store);
}

export function getActiveId(): string {
  if (typeof window === "undefined") return "stu_1";
  return localStorage.getItem(ACTIVE) || "stu_1";
}

export function setActiveId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE, id);
}

export function resetClass() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(ACTIVE);
}
