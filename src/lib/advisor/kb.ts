// ER Advisor knowledge base — Phase 0 seed + retrieval.
//
// This is a small, hand-curated set of Australian Fair Work provisions, used to
// prove the triage → grounded-answer → verification loop end-to-end before we
// build the real ingestion pipeline (docs/er-advisor-spec.md §5.2).
//
// EVERY chunk carries a citationLabel, a source URL, and a version/as-at date so
// every answer can be grounded and dated. The provision text is a faithful
// plain-English rendering of the section for retrieval; the authoritative text
// is always the source at `url`. This is an information tool, not legal advice.
//
// Phase 1 replaces this file's static array with a versioned store and swaps the
// keyword scorer below for hybrid (semantic + BM25) retrieval.

export const KB_VERSION_DATE = "2026-06-01";

const FW_ACT = "Fair Work Act 2009 (Cth)";
const FW_ACT_URL = "https://www.legislation.gov.au/C2009A00028/latest/text";

export type KbChunk = {
  id: string;
  act: string;
  /** Human citation, e.g. "s.387 Fair Work Act 2009 (Cth)". */
  citationLabel: string;
  heading: string;
  text: string;
  url: string;
  version: string; // as-at date for this chunk
  topics: string[]; // retrieval hints
};

function section(
  num: string,
  heading: string,
  text: string,
  topics: string[],
): KbChunk {
  return {
    id: `fwact-s${num}`,
    act: FW_ACT,
    citationLabel: `s.${num} ${FW_ACT}`,
    heading,
    text,
    url: `${FW_ACT_URL}#s${num}`,
    version: KB_VERSION_DATE,
    topics,
  };
}

export const KB: KbChunk[] = [
  section(
    "23",
    "Meaning of small business employer",
    "A national system employer is a small business employer at a particular time if the employer employs fewer than 15 employees at that time. All employees employed at that time are counted, including the employee being dismissed and employees of associated entities. A casual employee is not counted unless, at that time, they have been employed on a regular and systematic basis.",
    ["small business", "15 employees", "headcount", "employer size", "casual count"],
  ),
  section(
    "65",
    "Requests for flexible working arrangements",
    "An employee may request a change in working arrangements if they are a parent or carer of a child of school age or younger, a carer, have a disability, are 55 or older, are pregnant, or are experiencing family or domestic violence (or caring for a household or family member who is). An employee (other than a casual) must have completed at least 12 months of continuous service before making the request; a casual must be a regular casual with a reasonable expectation of continuing employment.",
    ["flexible work", "flexible working arrangements", "request", "carer", "parent", "section 65"],
  ),
  section(
    "65A",
    "Responding to requests for flexible working arrangements",
    "The employer must give the employee a written response within 21 days, stating whether the request is granted or refused. The employer may refuse the request only if they have discussed it with the employee, genuinely tried to reach agreement, had regard to the consequences of refusal for the employee, and the refusal is on reasonable business grounds. A written refusal must set out the reasons, including the particular business grounds, and the changes (if any) the employer is willing to make.",
    ["flexible work", "refuse request", "reasonable business grounds", "21 days", "response"],
  ),
  section(
    "117",
    "Requirement for notice of termination or payment in lieu (NES)",
    "An employer must not terminate an employee's employment unless they have given written notice of the day of termination. The minimum notice period depends on the employee's continuous service: not more than 1 year = 1 week; more than 1 but not more than 3 years = 2 weeks; more than 3 but not more than 5 years = 3 weeks; more than 5 years = 4 weeks. Add 1 extra week if the employee is over 45 and has at least 2 years of continuous service. Notice may be paid out in lieu.",
    ["notice", "notice period", "termination notice", "payment in lieu", "NES"],
  ),
  section(
    "119",
    "Redundancy pay (NES)",
    "An employee is entitled to redundancy pay if their employment is terminated at the employer's initiative because the employer no longer requires the job to be done by anyone (except where due to the ordinary and customary turnover of labour), or because of the employer's insolvency or bankruptcy. The amount is based on continuous service on a sliding scale — for example at least 1 year but less than 2 = 4 weeks' pay, rising to 12 weeks at 9–10 years. Small business employers are generally not required to pay NES redundancy pay.",
    ["redundancy", "redundancy pay", "severance", "operational requirements", "NES"],
  ),
  section(
    "340",
    "Protection — adverse action and workplace rights (general protections)",
    "A person must not take adverse action against another person because that other person has a workplace right, has or has not exercised a workplace right, or proposes to exercise (or not exercise) a workplace right; nor to prevent the exercise of a workplace right. Unlike unfair dismissal, a general-protections claim has no minimum employment period and is not limited by the high income threshold.",
    ["general protections", "adverse action", "workplace right", "no minimum period", "section 340"],
  ),
  section(
    "341",
    "Meaning of workplace right",
    "A person has a workplace right if they: are entitled to the benefit of, or have a role or responsibility under, a workplace law, workplace instrument or order; are able to initiate or participate in a process or proceedings under a workplace law or instrument; or are able to make a complaint or inquiry to a person or body to seek compliance with a workplace law or instrument, or (for an employee) in relation to their employment.",
    ["workplace right", "complaint", "inquiry", "general protections"],
  ),
  section(
    "342",
    "Meaning of adverse action",
    "Adverse action taken by an employer against an employee includes dismissing the employee, injuring the employee in their employment, altering the employee's position to their prejudice, or discriminating between the employee and other employees of the employer.",
    ["adverse action", "dismissal", "demotion", "discrimination", "general protections"],
  ),
  section(
    "382",
    "When a person is protected from unfair dismissal",
    "A person is protected from unfair dismissal at a time if, at that time, the person has completed the minimum employment period AND one or more of the following apply: a modern award covers the person; an enterprise agreement applies to the person; or the sum of the person's annual rate of earnings (and other amounts worked out as prescribed) is less than the high income threshold.",
    ["unfair dismissal", "protected", "eligibility", "high income threshold", "minimum employment period", "award covered"],
  ),
  section(
    "383",
    "Meaning of minimum employment period",
    "The minimum employment period is: (a) if the employer is NOT a small business employer — 6 months ending at the earlier of the time the person is given notice of dismissal and immediately before the dismissal; or (b) if the employer IS a small business employer — 12 months.",
    ["minimum employment period", "6 months", "12 months", "small business", "qualifying period", "unfair dismissal eligibility"],
  ),
  section(
    "384",
    "Period of employment",
    "An employee's period of employment with an employer is the period of continuous service the employee has completed. A period of service as a casual employee counts towards continuous service only if the employment was on a regular and systematic basis and, during that period, the employee had a reasonable expectation of continuing employment on a regular and systematic basis.",
    ["continuous service", "casual", "regular and systematic", "period of employment", "tenure"],
  ),
  section(
    "385",
    "What is an unfair dismissal",
    "A person has been unfairly dismissed if the Fair Work Commission is satisfied that ALL of the following apply: the person was dismissed; the dismissal was harsh, unjust or unreasonable; the dismissal was not consistent with the Small Business Fair Dismissal Code; and the dismissal was not a case of genuine redundancy.",
    ["unfair dismissal", "harsh unjust unreasonable", "definition", "small business code", "genuine redundancy"],
  ),
  section(
    "387",
    "Criteria for considering harshness etc.",
    "In considering whether a dismissal was harsh, unjust or unreasonable, the FWC must take into account: (a) whether there was a valid reason for the dismissal related to the person's capacity or conduct; (b) whether the person was notified of that reason; (c) whether the person was given an opportunity to respond to any reason related to their capacity or conduct; (d) any unreasonable refusal by the employer to allow a support person to assist at discussions relating to dismissal; (e) if the dismissal related to unsatisfactory performance — whether the person had been warned about that performance before the dismissal; (f) the degree to which the size of the employer's enterprise would be likely to impact on the procedures followed; (g) the degree to which the absence of dedicated human resource management specialists would be likely to impact on procedures; and (h) any other matters the FWC considers relevant.",
    ["unfair dismissal", "procedural fairness", "valid reason", "warning", "opportunity to respond", "support person", "conduct", "capacity", "process", "section 387"],
  ),
  section(
    "388",
    "The Small Business Fair Dismissal Code",
    "A person's dismissal is consistent with the Small Business Fair Dismissal Code if, immediately before the time of the dismissal or at the time the person was given notice of the dismissal (whichever is earlier), the employer was a small business employer, and the employer complied with the Code in relation to the dismissal.",
    ["small business", "fair dismissal code", "summary dismissal", "serious misconduct"],
  ),
  section(
    "389",
    "Meaning of genuine redundancy",
    "A dismissal is a genuine redundancy if the employer no longer required the person's job to be performed by anyone because of changes in the operational requirements of the enterprise, and the employer complied with any obligation in a modern award or enterprise agreement to consult about the redundancy. It is NOT a genuine redundancy if it would have been reasonable in all the circumstances for the person to be redeployed within the employer's enterprise or the enterprise of an associated entity.",
    ["redundancy", "genuine redundancy", "redeployment", "consultation", "operational requirements"],
  ),
  section(
    "394",
    "Application for unfair dismissal remedy",
    "An application for an unfair dismissal remedy must be made to the Fair Work Commission within 21 days after the dismissal took effect, or within such further period as the FWC allows where it is satisfied there are exceptional circumstances.",
    ["unfair dismissal", "21 days", "time limit", "application", "deadline", "lodge"],
  ),
];

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Words of a string, for prefix-based matching. */
function wordsOf(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

/**
 * Lightweight stem-ish match: handles redundant/redundancy, dismiss/dismissal,
 * late/lateness without a real stemmer. Short terms (<5 chars) require an exact
 * word; longer terms match on a shared 5-char prefix.
 */
function termMatches(term: string, words: string[]): boolean {
  if (term.length < 5) return words.includes(term);
  const prefix = term.slice(0, 5);
  return words.some((w) => w.length >= 5 && w.slice(0, 5) === prefix);
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "is", "are", "for", "on",
  "with", "as", "at", "be", "by", "it", "this", "that", "i", "we", "they",
  "he", "she", "my", "our", "their", "can", "do", "does", "if", "what", "how",
  "should", "would", "have", "has", "had", "was", "were", "want", "need",
]);

/**
 * Phase 0 keyword retrieval. Scores each chunk by overlap of query terms with
 * the chunk's text, heading and topic tags, with boosts for topic hits and any
 * explicit section number in the query ("s.387", "section 387", "387").
 * Returns the top `k` chunks. Phase 1 swaps this for hybrid semantic + BM25.
 */
export function retrieve(query: string, k = 6): KbChunk[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  // Explicit section references in the query, e.g. "s387", "section 387".
  const sectionRefs = new Set(
    (query.toLowerCase().match(/(?:s\.?|section)\s*([0-9]+[a-z]?)/g) ?? []).map(
      (m) => m.replace(/[^0-9a-z]/g, "").replace(/^s/, "").replace(/^ection/, ""),
    ),
  );

  const scored = KB.map((chunk) => {
    const textWords = wordsOf(`${chunk.heading} ${chunk.text}`);
    const topicWords = wordsOf(chunk.topics.join(" "));
    let score = 0;
    for (const term of terms) {
      if (termMatches(term, topicWords)) score += 3;
      if (termMatches(term, textWords)) score += 1;
    }
    // Big boost for an exact section-number match.
    const num = chunk.id.replace("fwact-s", "");
    if (sectionRefs.has(num)) score += 20;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.chunk);
}

/** Look up a chunk by its citation label (used by the verification pass). */
export function chunkByCitation(label: string): KbChunk | undefined {
  return KB.find((c) => c.citationLabel === label);
}
