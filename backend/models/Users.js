import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema({
  theme: { type: String, default: "auto" },
  language: { type: String, default: "fr" },
  notifications: { type: Boolean, default: true },
  defaultFormTheme: { type: String, default: "default" },
});

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  preferences: PreferencesSchema,
});

export default mongoose.model("users", UserSchema);
