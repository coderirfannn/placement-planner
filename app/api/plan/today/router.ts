import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Plan } from "@/models/Plan";
import { generateDailyPlan } from "@/lib/planGenerator";

function todayKey() {
  const d = new Date();
  // Use local date (MVP). For India users this is fine.
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const dateKey = todayKey();

  let plan = await Plan.findOne({ userId: user._id, dateKey }).lean();

  if (!plan) {
    // compute yesterday completion (simple)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(
      yesterday.getDate()
    ).padStart(2, "0")}`;

    const yPlan = await Plan.findOne({ userId: user._id, dateKey: yKey }).lean();
    const yesterdayPct = yPlan
      ? Math.round(
          (yPlan.tasks.filter((t: any) => t.status === "done").length / Math.max(1, yPlan.tasks.length)) * 100
        )
      : 100;

    const tasks = generateDailyPlan({
      segment: user.segment,
      track: user.track,
      timeMinutes: user.timeMinutes,
      yesterdayCompletionPct: yesterdayPct,
    });

    plan = await Plan.create({
      userId: user._id,
      dateKey,
      timeMinutes: user.timeMinutes,
      segment: user.segment,
      track: user.track,
      tasks,
    });

    plan = plan.toObject();
  }

  return NextResponse.json({ plan });
}
