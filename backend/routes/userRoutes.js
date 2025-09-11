import express from "express";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

import dotenv from "dotenv";
dotenv.config(); 

// GET all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET one user by id
router.get("/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  res.json(user);
});

// Route GET /me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json(user); // toujours un objet user
  } catch (error) {
    console.error("Erreur GET /me:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// PUT update user
router.put("/:id", async (req, res) => {
  const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updatedUser);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await User.findOneAndDelete({ id: req.params.id });
  res.json({ message: "User deleted" });
});

// POST create new user
router.post("/register", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Génération du token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
});


// console.log(process.env.JWT_SECRET, 'process.env.JWT_SECRET');

export default router;
