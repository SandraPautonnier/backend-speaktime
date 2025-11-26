import Meeting from "../models/Meeting.js";

//  Cr�er une nouvelle r�union
export const createMeeting = async (req, res) => {
  try {
    const userId = req.user._id;
    const { groupId, participants, duration } = req.body;

    // Validation
    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return res.status(400).json({ message: "Les participants sont requis." });
    }

    if (!duration || duration <= 0) {
      return res
        .status(400)
        .json({ message: "La dur�e doit �tre sup�rieure � 0." });
    }

    // G�n�rer le titre : "R�union du 05/11/2025"
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const title = `Réunion du ${day}/${month}/${year}`;

    // Créer la réunion
    const newMeeting = new Meeting({
      userId,
      groupId: groupId || null,
      title,
      date: now,
      duration,
      participants: participants.map((p) => {
        // G�rer les deux formats : string ou objet {name, speakingTime}
        if (typeof p === "string") {
          return { name: p, speakingTime: 0 };
        }
        return { name: p.name, speakingTime: p.speakingTime || 0 };
      }),
      notes: "",
    });

    await newMeeting.save();
    res
      .status(201)
      .json({ message: "Réunion créée avec succès !", meeting: newMeeting });
  } catch (error) {
    console.error("Erreur lors de la création de la réunion :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

//  R�cup�rer toutes les r�unions de l'utilisateur
export const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;

    const meetings = await Meeting.find({ userId })
      .sort({ date: -1 }) // Plus r�centes en premier
      .populate("groupId", "name");

    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  R�cup�rer une r�union sp�cifique (v�rifier l'ownership)
export const getMeetingById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const meeting = await Meeting.findById(id).populate("groupId", "name");

    if (!meeting) {
      return res.status(404).json({ message: "R�union non trouv�e." });
    }

    // V�rifier que la r�union appartient � l'utilisateur
    if (meeting.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Acc�s non autoris� � cette r�union." });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre � jour les temps de parole d'une r�union
export const updateMeetingParticipants = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { participants } = req.body;

    if (!participants || !Array.isArray(participants)) {
      return res
        .status(400)
        .json({ message: "Les participants doivent �tre un tableau." });
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ message: "R�union non trouv�e." });
    }

    // V�rifier l'ownership
    if (meeting.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Acc�s non autoris� � cette r�union." });
    }

    // Mettre � jour les temps de parole
    meeting.participants = participants;
    await meeting.save();

    res.status(200).json({ message: "Temps de parole mis � jour !", meeting });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Supprimer une r�union
export const deleteMeeting = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ message: "R�union non trouv�e." });
    }

    // V�rifier l'ownership
    if (meeting.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Acc�s non autoris� � cette r�union." });
    }

    await Meeting.findByIdAndDelete(id);

    res.status(200).json({ message: "R�union supprim�e avec succ�s !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
