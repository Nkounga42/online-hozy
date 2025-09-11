import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  id: String,
  type: { type: String, required: true },
  label: String,
  required: Boolean,
  options: [String], 
});

const PageSchema = new mongoose.Schema({
  order: Number,
  title: String,
  fields: [FieldSchema],
});

const SettingsSchema = new mongoose.Schema({
  collectEmails: { type: Boolean, default: false },
  allowMultipleResponses: { type: Boolean, default: false },
  showProgressBar: { type: Boolean, default: false },
  pageNavigation: { type: Boolean, default: true },
});

const FormSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  createById: String,
  groupId: { type: Number, default: 0 },
  theme: { type: String, default: "default" },
  title: { type: String, required: true },
  description: String,
  createdAt: { type: Date },
  updateAt: { type: Date },
  settings: { type: SettingsSchema, default: () => ({}) },
  pages: [PageSchema],
  views: [
    {
      userId: { type: String, default: null },
      ip: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],

  submissions: [
    {
      userId: { type: String, default: null },
      answers: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("projects", FormSchema);
