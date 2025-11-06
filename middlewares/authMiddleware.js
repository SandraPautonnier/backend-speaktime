import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    // Vérifie si un token est présent dans les headers (format : "Bearer <token>")
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Récupération du token
      token = req.headers.authorization.split(" ")[1];

      // Vérification du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Recherche de l'utilisateur dans la base (sans renvoyer le mot de passe)
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Passe la main au contrôleur suivant
      next();
    } else {
      return res.status(401).json({ message: "Accès non autorisé, token manquant" });
    }
  } catch (error) {
    console.error("Erreur middleware protect :", error);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

