import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  createById: String,
  formId: String, 
});

export default mongoose.model("views", ViewSchema);
