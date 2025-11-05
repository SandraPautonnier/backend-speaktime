import Group from "../models/Group.js";

// Créer un groupe
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const userId = req.user._id; //  Récupérer l'userId du token

    // Validation des champs obligatoires
    if (!name) {
      return res.status(400).json({ message: "Le nom du groupe est requis." });
    }

    // Crée le nouveau groupe
    const newGroup = new Group({
      userId, //  Associer le groupe à l'utilisateur
      name,
      description: description || "",
      members: members && Array.isArray(members) ? members : [],
    });

    await newGroup.save();
    res
      .status(201)
      .json({ message: "Groupe créé avec succès !", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer tous les groupes de l'utilisateur connecté
export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id; //  Récupérer l'userId du token
    const groups = await Group.find({ userId }); //  Filtrer par userId
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer un groupe par ID (vérifier ownership)
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier que le groupe appartient à l'utilisateur
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour le nom du groupe
export const updateGroupName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Le nom du groupe est requis." });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: "Nom du groupe mis à jour !", group: updatedGroup });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour la description du groupe
export const updateGroupDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user._id;

    if (description === undefined) {
      return res.status(400).json({ message: "La description est requise." });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({
        message: "Description du groupe mise à jour !",
        group: updatedGroup,
      });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Ajouter un ou plusieurs membres au groupe
export const addMembersToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(members) || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Un tableau de noms de membres est requis." });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    // Ajoute les nouveaux membres sans doublons
    const uniqueMembers = new Set([...group.members, ...members]);
    group.members = Array.from(uniqueMembers);

    await group.save();
    res.status(200).json({ message: "Membres ajoutés au groupe !", group });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Retirer un ou plusieurs membres du groupe
export const removeMembersFromGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(members) || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Un tableau de noms de membres est requis." });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    // Retire les membres spécifiés
    group.members = group.members.filter((member) => !members.includes(member));

    await group.save();
    res.status(200).json({ message: "Membres retirés du groupe !", group });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer la liste des membres du groupe
export const getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    res.status(200).json({ members: group.members, groupName: group.name });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un groupe
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé." });
    }

    //  Vérifier l'ownership
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé à ce groupe." });
    }

    const deletedGroup = await Group.findByIdAndDelete(id);

    res.status(200).json({ message: "Groupe supprimé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
