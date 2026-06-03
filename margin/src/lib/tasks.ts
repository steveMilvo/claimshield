import type { TextType } from "./types";

/** A writing task. `parallelForm` lets us issue an equated cold-write that
 * targets the same traits without being the prompt the student practised on —
 * this is how transfer (and therefore mastery) is measured honestly. */
export interface WritingTask {
  id: string;
  textType: TextType;
  /** Year band this prompt is pitched at. */
  year: "7" | "8" | "9";
  title: string;
  prompt: string;
  /** Suggested length to keep cognitive load age-appropriate. */
  targetWords: number;
  /** Id of an equated parallel prompt used for transfer checks. */
  parallelForm?: string;
}

export const TASKS: WritingTask[] = [
  {
    id: "persuasive.phones",
    textType: "persuasive",
    year: "8",
    title: "Phones in school",
    prompt:
      "Some people think students should be allowed to use mobile phones during class. Write to persuade your school principal to agree with your view. Use reasons and examples.",
    targetWords: 250,
    parallelForm: "persuasive.homework",
  },
  {
    id: "persuasive.homework",
    textType: "persuasive",
    year: "8",
    title: "Should homework be banned?",
    prompt:
      "Your class is debating whether homework should be banned. Write to persuade your classmates to agree with your view. Use reasons and examples.",
    targetWords: 250,
    parallelForm: "persuasive.phones",
  },
  {
    id: "narrative.door",
    textType: "narrative",
    year: "8",
    title: "The door that shouldn't open",
    prompt:
      "Write a story that begins the moment a character opens a door they were told never to open.",
    targetWords: 300,
    parallelForm: "narrative.message",
  },
  {
    id: "narrative.message",
    textType: "narrative",
    year: "8",
    title: "The message in the sand",
    prompt:
      "Write a story about a character who finds a message written in the sand that is meant for them.",
    targetWords: 300,
    parallelForm: "narrative.door",
  },
];

export const TASK_MAP: Record<string, WritingTask> = Object.fromEntries(
  TASKS.map((t) => [t.id, t])
);

export function tasksByType(type: TextType): WritingTask[] {
  return TASKS.filter((t) => t.textType === type);
}
