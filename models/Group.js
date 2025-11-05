import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    members: { type: [String], default: [] }, // liste de noms
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
