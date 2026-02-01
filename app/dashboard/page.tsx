"use client";

import { useEffect, useState } from "react";

type Task = {
  key: string;
  title: string;
  minutes: number;
  exactAction: string;
  doneDefinition: string;
  status: "todo" | "done" | "skipped";
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dateKey, setDateKey] = useState<string>("");

  async function load() {
    const res = await fetch("/api/plan/today");
    const data = await res.json();
    setTasks(data.plan.tasks);
    setDateKey(data.plan.dateKey);
  }

  async function updateTask(taskKey: string, status: "done" | "skipped") {
    await fetch("/api/plan/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateKey, taskKey, status }),
    });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Today’s Plan</h1>

      {tasks.map((t) => (
        <div key={t.key} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {t.title} • {t.minutes} min
            </div>
            <div className="text-sm">
              {t.status === "todo" ? "⏳" : t.status === "done" ? "✅" : "⛔"}
            </div>
          </div>

          <div className="text-sm text-gray-700">{t.exactAction}</div>
          <div className="text-xs text-gray-500">Done means: {t.doneDefinition}</div>

          <div className="flex gap-2 pt-2">
            <button
              className="px-3 py-1 rounded bg-black text-white text-sm"
              onClick={() => updateTask(t.key, "done")}
            >
              Mark Done
            </button>
            <button
              className="px-3 py-1 rounded border text-sm"
              onClick={() => updateTask(t.key, "skipped")}
            >
              Skip
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
