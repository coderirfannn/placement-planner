type Segment = "A" | "B" | "C";
type Track = "sde" | "web" | "java";

export type GeneratedTask = {
  key: string;
  category: "dsa" | "core" | "project" | "revision";
  title: string;
  minutes: number;
  exactAction: string;
  doneDefinition: string;
  resourceHint?: string;
};

function splitTime(timeMinutes: number) {
  // Keep 4 blocks max. Adjust by total time.
  if (timeMinutes <= 60) {
    return { dsa: 25, core: 15, project: 15, revision: 5 };
  }
  if (timeMinutes <= 120) {
    return { dsa: 45, core: 30, project: 30, revision: 15 };
  }
  // 180
  return { dsa: 70, core: 45, project: 45, revision: 20 };
}

function pickCoreSubject(track: Track) {
  // Keep it simple. Rotate later.
  if (track === "web") return "DBMS";
  if (track === "java") return "OOP";
  return "OS";
}

function dsaTask(segment: Segment, minutes: number): GeneratedTask[] {
  const difficulty =
    segment === "A" ? "easy" : segment === "B" ? "easy+medium" : "medium";

  return [
    {
      key: "dsa_1",
      category: "dsa",
      title: `DSA Practice (${difficulty})`,
      minutes,
      exactAction:
        segment === "A"
          ? "Solve 2 easy problems from Arrays/Strings. If stuck, read solution after 15 minutes and rewrite it yourself."
          : segment === "B"
          ? "Solve 1 easy + 1 medium problem. Write down approach before coding."
          : "Solve 2 medium problems. For each, write time/space complexity and edge cases.",
      doneDefinition:
        "At least 2 submissions OR 1 complete solution + written approach + noted mistakes.",
      resourceHint: "LeetCode / GFG (pick any)",
    },
  ];
}

function coreTask(track: Track, minutes: number): GeneratedTask[] {
  const subject = pickCoreSubject(track);
  const topic =
    subject === "OS"
      ? "Process vs Thread + Scheduling basics"
      : subject === "DBMS"
      ? "Keys + Normalization basics"
      : "OOP pillars + abstraction vs interface";

  return [
    {
      key: "core_1",
      category: "core",
      title: `${subject} (Core CS)`,
      minutes,
      exactAction: `Study: ${topic}. Create a 10-line notes cheat sheet + 5 quick Q&A.`,
      doneDefinition: "Cheat sheet + 5 Q&A written (not just read).",
      resourceHint: "Your class notes / any standard playlist",
    },
  ];
}

function projectTask(track: Track, minutes: number): GeneratedTask[] {
  if (track === "web") {
    return [
      {
        key: "proj_1",
        category: "project",
        title: "Project Work (Web)",
        minutes,
        exactAction:
          "Implement one small feature or fix one bug in your project. Commit changes with a meaningful message.",
        doneDefinition: "One feature/bug done + code committed (even local).",
        resourceHint: "Your ongoing project repo",
      },
    ];
  }

  if (track === "java") {
    return [
      {
        key: "proj_1",
        category: "project",
        title: "Project Work (Java)",
        minutes,
        exactAction:
          "Add one module/class or refactor one part (e.g., validation, service layer). Write 3 test cases or sample runs.",
        doneDefinition: "Change implemented + 3 tests/sample runs documented.",
        resourceHint: "Your Java project",
      },
    ];
  }

  // sde general
  return [
    {
      key: "proj_1",
      category: "project",
      title: "Project Work (SDE)",
      minutes,
      exactAction:
        "Pick one feature improvement: input validation, error handling, logging, or refactoring. Make a small commit.",
      doneDefinition: "One improvement merged into your branch + short note what changed.",
      resourceHint: "Any project",
    },
  ];
}

function revisionTask(minutes: number): GeneratedTask[] {
  return [
    {
      key: "rev_1",
      category: "revision",
      title: "Revision (Mistakes + Flash)",
      minutes,
      exactAction:
        "Review yesterday’s DSA mistakes + rewrite 1 problem approach from memory. Revise 5 core CS Q&A.",
      doneDefinition: "1 approach rewritten + 5 Q&A revised.",
      resourceHint: "Your notes",
    },
  ];
}

export function generateDailyPlan(input: {
  segment: Segment;
  track: Track;
  timeMinutes: number;
  yesterdayCompletionPct?: number; // optional
}) {
  const base = splitTime(input.timeMinutes);

  // Recovery rule: if yesterday was weak, reduce new load
  const recovery = (input.yesterdayCompletionPct ?? 100) < 60;
  const factor = recovery ? 0.85 : 1;

  const dsaM = Math.max(15, Math.round(base.dsa * factor));
  const coreM = Math.max(10, Math.round(base.core * factor));
  const projM = Math.max(10, Math.round(base.project * factor));
  const revM = Math.max(5, Math.round(base.revision + (recovery ? 5 : 0)));

  const tasks: GeneratedTask[] = [
    ...dsaTask(input.segment, dsaM),
    ...coreTask(input.track, coreM),
    ...projectTask(input.track, projM),
    ...revisionTask(revM),
  ];

  return tasks;
}
