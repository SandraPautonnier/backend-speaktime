import User from "../models/User.js";
import bcrypt from "bcrypt";

//  Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // on enlève le mot de passe
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//  Récupérer un utilisateur par ID (vérifier que c'est le sien)
export const getUserById = async (req, res) => {
  try {
    const userId = req.user._id; //  Utilisateur connecté
    const requestedId = req.params.id; //  ID demandé

    // Vérifier que l'utilisateur accède à son propre profil
    if (userId.toString() !== requestedId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce profil." });
    }

    const user = await User.findById(requestedId).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//  Mettre à jour un utilisateur par ID (vérifier l'ownership)
export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id; //  Utilisateur connecté
    const requestedId = req.params.id; //  ID à modifier

    // Vérifier que l'utilisateur modifie son propre compte
    if (userId.toString() !== requestedId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé. Vous ne pouvez modifier que votre propre compte." });
    }

    const { username, email, password } = req.body;
    const user = await User.findById(requestedId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//  Supprimer un utilisateur par ID (vérifier l'ownership)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id; //  Utilisateur connecté
    const requestedId = req.params.id; //  ID à supprimer

    // Vérifier que l'utilisateur supprime son propre compte
    if (userId.toString() !== requestedId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé. Vous ne pouvez supprimer que votre propre compte." });
    }

    const user = await User.findById(requestedId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await user.deleteOne();
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
