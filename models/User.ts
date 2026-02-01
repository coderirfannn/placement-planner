import { Schema, model, models } from "mongoose";

export type UserSegment = "A" | "B" | "C";
export type Track = "sde" | "web" | "java";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },

    // onboarding fields:
    segment: { type: String, enum: ["A", "B", "C"], default: "A" },
    timeMinutes: { type: Number, enum: [60, 120, 180], default: 120 },
    track: { type: String, enum: ["sde", "web", "java"], default: "sde" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
