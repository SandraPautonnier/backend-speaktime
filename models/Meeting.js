import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    title: { type: String, required: true }, 
    date: { type: Date, default: Date.now },
    duration: { type: Number, required: true }, // durée totale en secondes
    participants: [
      {
        name: { type: String, required: true },
        speakingTime: { type: Number, default: 0 }, // temps de parole individuel en secondes
      },
    ],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
