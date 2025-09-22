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

// POST submit form (route publique)
router.post("/:id/submit", async (req, res) => {
  try {
    const formId = req.params.id;
    const { answers } = req.body;
    
    // Vérifier si l'utilisateur est authentifié (optionnel)
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token invalide, on continue avec userId = null
        console.log('Token invalide pour la soumission:', err.message);
      }
    }

    // Trouver le formulaire (pas besoin que ce soit le créateur)
    const form = await Form.findOne({ id: formId });
    if (!form) return res.status(404).json({ message: "Formulaire non trouvé" });

    // Ajouter la soumission
    const updatedForm = await Form.findOneAndUpdate(
      { id: formId },
      {
        $push: {
          submissions: { 
            userId, 
            answers, 
            timestamp: new Date(),
            ip: req.ip // Ajouter l'IP pour tracer les soumissions anonymes
          },
        },
      },
      { new: true }
    );

    res.json({ message: "Réponse enregistrée", form: updatedForm });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET user statistics
router.get("/stats/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer tous les formulaires de l'utilisateur
    const userForms = await Form.find({ createById: userId });
    
    // Calculer les statistiques
    const totalForms = userForms.length;
    let totalResponses = 0;
    let totalViews = 0;
    let mostPopularForm = "";
    let maxResponses = 0;
    
    // Date du début du mois actuel
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    let formsThisMonth = 0;
    let responsesThisMonth = 0;
    
    userForms.forEach(form => {
      // Compter les réponses
      const formResponses = form.submissions ? form.submissions.length : 0;
      totalResponses += formResponses;
      
      // Compter les vues
      const formViews = form.views ? form.views.length : 0;
      totalViews += formViews;
      
      // Trouver le formulaire le plus populaire
      if (formResponses > maxResponses) {
        maxResponses = formResponses;
        mostPopularForm = form.title;
      }
      
      // Compter les formulaires créés ce mois
      if (form.createdAt && new Date(form.createdAt) >= startOfMonth) {
        formsThisMonth++;
      }
      
      // Compter les réponses de ce mois
      if (form.submissions) {
        form.submissions.forEach(submission => {
          if (submission.timestamp && new Date(submission.timestamp) >= startOfMonth) {
            responsesThisMonth++;
          }
        });
      }
    });
    
    // Calculer le taux de réponse moyen
    const averageResponseRate = totalViews > 0 ? ((totalResponses / totalViews) * 100) : 0;
    
    // Date d'inscription (premier formulaire créé)
    const joinDate = userForms.length > 0 
      ? new Date(Math.min(...userForms.map(f => new Date(f.createdAt || Date.now()).getTime())))
      : new Date();
    
    const stats = {
      totalForms,
      totalResponses,
      totalViews,
      formsThisMonth,
      responsesThisMonth,
      averageResponseRate: Math.round(averageResponseRate * 100) / 100,
      mostPopularForm: mostPopularForm || "Aucun",
      joinDate: joinDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    };
    
    res.json(stats);
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
