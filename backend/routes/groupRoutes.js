import express from "express";
import Group from "../models/Groups.js";

const router = express.Router();

// GET all groups
router.get("/", async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

// GET one group by id
router.get("/:id", async (req, res) => {
  const group = await Group.findOne({ id: req.params.id });
  res.json(group);
});

// POST create new group
router.post("/", async (req, res) => {
  const newGroup = new Group(req.body);
  await newGroup.save();
  res.json(newGroup);
});

// PUT update group
router.put("/:id", async (req, res) => {
  const updatedGroup = await Group.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updatedGroup);
});

// DELETE group
router.delete("/:id", async (req, res) => {
  await Group.findOneAndDelete({ id: req.params.id });
  res.json({ message: "Group deleted" });
});
// DELETE group
router.delete("/group/:id", async (req, res) => {
  try {
    // Supprimer tous les formulaires du groupe
    await Form.deleteMany({ groupId: req.params.id });
    // Supprimer le groupe
    await Group.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Groupe supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT rename group
router.put("/group/:id/rename", async (req, res) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { id: req.params.id },
      { title: req.body.title },
      { new: true }
    );
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST duplicate group
router.post("/group/:id/duplicate", async (req, res) => {
  try {
    const group = await Group.findOne({ id: req.params.id });
    if (!group) return res.status(404).json({ message: "Groupe non trouvé" });

    const newGroup = new Group({
      ...group.toObject(),
      id: undefined,
      title: group.title + " (Copie)"
    });
    await newGroup.save();

    // Dupliquer les formulaires du groupe
    const forms = await Form.find({ groupId: group.id });
    for (const f of forms) {
      const newForm = new Form({ ...f.toObject(), id: undefined, groupId: newGroup.id });
      await newForm.save();
    }

    res.status(201).json({ group: newGroup, forms: await Form.find({ groupId: newGroup.id }) });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET export group
router.get("/group/:id/export", async (req, res) => {
  try {
    const group = await Group.findOne({ id: req.params.id });
    const forms = await Form.find({ groupId: req.params.id });

    res.setHeader("Content-Disposition", `attachment; filename=${group.title}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ group, forms }, null, 2));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET share group
router.get("/group/:id/share", async (req, res) => {
  try {
    const group = await Group.findOne({ id: req.params.id });
    const shareUrl = `${process.env.FRONTEND_URL}/groups/${group.id}`;
    res.json({ shareUrl });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
