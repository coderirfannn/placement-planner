import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    key: { type: String, required: true }, // stable identifier like "dsa_1"
    category: { type: String, enum: ["dsa", "core", "project", "revision"], required: true },
    title: { type: String, required: true },
    minutes: { type: Number, required: true },
    exactAction: { type: String, required: true },
    doneDefinition: { type: String, required: true },
    resourceHint: { type: String, default: "" },
    status: { type: String, enum: ["todo", "done", "skipped"], default: "todo" },
  },
  { _id: false }
);

const PlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    dateKey: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    timeMinutes: { type: Number, required: true },
    segment: { type: String, required: true },
    track: { type: String, required: true },
    tasks: { type: [TaskSchema], default: [] },
  },
  { timestamps: true }
);

PlanSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export const Plan = models.Plan || model("Plan", PlanSchema);
