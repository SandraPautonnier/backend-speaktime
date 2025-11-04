import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupName,
  updateGroupDescription,
  addMembersToGroup,
  removeMembersFromGroup,
  getGroupMembers,
  deleteGroup,
} from "../controllers/groupController.js";

const router = express.Router();

// Créer un groupe
router.post("/", createGroup);

// Récupérer tous les groupes
router.get("/", getAllGroups);

// Récupérer un groupe par ID
router.get("/:id", getGroupById);

// Récupérer les membres d'un groupe (pour utilisation dans l'app)
router.get("/:id/members", getGroupMembers);

// Mettre à jour le nom du groupe
router.put("/:id/name", updateGroupName);

// Mettre à jour la description du groupe
router.put("/:id/description", updateGroupDescription);

// Ajouter des membres au groupe
router.post("/:id/members", addMembersToGroup);

// Retirer des membres du groupe
router.delete("/:id/members", removeMembersFromGroup);

// Supprimer un groupe
router.delete("/:id", deleteGroup);

export default router;
