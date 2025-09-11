import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
});

export default mongoose.model("groups", GroupSchema);
