import express from "express";
import Form from "../models/Forms.js";
import { v4 as uuidv4 } from "uuid";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET all forms avec pagination 
router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const userId = req.user.id;

    const total = await Form.countDocuments({ createById: userId });
    const forms = await Form.find({ createById: userId }).skip(skip).limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalForms: total,
      forms,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET forms by groupId avec pagination  
router.get("/group/:groupId", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const total = await Form.countDocuments({ groupId: req.params.groupId, createById: userId });
    const forms = await Form.find({ groupId: req.params.groupId, createById: userId }).skip(skip).limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalForms: total,
      forms,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET one form by id 
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form.findOne({ id: req.params.id, createById: userId });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET export form
router.get("/:id/export", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form.findOne({ id: req.params.id, createById: userId });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé" });

    res.setHeader("Content-Disposition", `attachment; filename=${form.title}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(form, null, 2));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET share form
router.get("/:id/share", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form.findOne({ id: req.params.id, createById: userId });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé" });

    const shareUrl = `${process.env.FRONTEND_URL}/form/${form.id}/view`;
    res.json({ shareUrl });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET view form
router.get("/:id/view", async (req, res) => {
  try {
    const form = await Form.findOne({ id: req.params.id });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé" });

    const userId = null; 
    const ip = req.ip;

    await Form.updateOne(
      { id: form.id },
      { $push: { views: { userId, ip, timestamp: new Date() } } }
    );

    res.json(form);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


// PUT update form
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedForm = await Form.findOneAndUpdate(
      { id: req.params.id, createById: userId },
      req.body,
      { new: true }
    );
    if (!updatedForm) return res.status(404).json({ message: "Formulaire non trouvé ou accès refusé" });
    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT rename form
router.put("/:id/rename", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedForm = await Form.findOneAndUpdate(
      { id: req.params.id, createById: userId },
      { title: req.body.title },
      { new: true }
    );
    if (!updatedForm) return res.status(404).json({ message: "Formulaire non trouvé ou accès refusé" });
    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST duplicate form
router.post("/:id/duplicate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form.findOne({ id: req.params.id, createById: userId });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé ou accès refusé" });

    const { _id, ...formData } = form.toObject(); // on retire _id

    const newForm = new Form({
      ...formData,
      id: uuidv4(),                // nouvel id pour ton app
      title: form.title + " (Copie)",
      createById: userId,
      createdAt: new Date(),
    });
    await newForm.save();


    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST create new form
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const newForm = new Form({
      ...req.body,
      id: uuidv4(),
      createById: userId,
      createdAt: new Date(),
    });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST submit form
router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const formId = req.params.id;
    const { answers } = req.body;

    const updatedForm = await Form.findOneAndUpdate(
      { id: formId, createById: userId },
      {
        $push: {
          submissions: { userId, answers, timestamp: new Date() },
        },
      },
      { new: true }
    );

    if (!updatedForm) return res.status(404).json({ message: "Formulaire non trouvé" });

    res.json({ message: "Réponse enregistrée", form: updatedForm });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// DELETE form
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await Form.findOneAndDelete({ id: req.params.id, createById: userId });
    if (!deleted) return res.status(404).json({ message: "Formulaire non trouvé ou accès refusé" });
    res.json({ message: "Formulaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
