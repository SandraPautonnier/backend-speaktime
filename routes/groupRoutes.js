import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
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
router.post("/", protect, createGroup);

// Récupérer tous les groupes
router.get("/", protect, getAllGroups);

// Récupérer un groupe par ID
router.get("/:id", protect, getGroupById);

// Récupérer les membres d'un groupe (pour utilisation dans l'app)
router.get("/:id/members", protect, getGroupMembers);

// Mettre à jour le nom du groupe
router.put("/:id/name", protect, updateGroupName);

// Mettre à jour la description du groupe
router.put("/:id/description", protect, updateGroupDescription);

// Ajouter des membres au groupe
router.post("/:id/members", protect, addMembersToGroup);

// Retirer des membres du groupe
router.delete("/:id/members", protect, removeMembersFromGroup);

// Supprimer un groupe
router.delete("/:id", protect, deleteGroup);

export default router;
