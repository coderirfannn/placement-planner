import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Plan } from "@/models/Plan";
import { TaskUpdateSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = TaskUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { dateKey, taskKey, status } = parsed.data;

  const plan = await Plan.findOne({ userId: user._id, dateKey });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const task = plan.tasks.find((t: any) => t.key === taskKey);
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  task.status = status;
  await plan.save();

  return NextResponse.json({ ok: true });
}
