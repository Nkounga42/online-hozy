import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import groupRoutes from "./routes/groupRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const serverUrl = process.env.MONGO_URI //|| "mongodb://127.0.0.1:27017";
// const dbCollection = `${serverUrl}/hozy-form-builder-db`;
const dbCollection = `${serverUrl}/hozy-form`;

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(dbCollection, { useNewUrlParser: true, 
    // useUnifiedTopology: true 
  })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/forms", formRoutes); 


const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
