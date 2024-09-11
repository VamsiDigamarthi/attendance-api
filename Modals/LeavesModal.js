import mongoose from "mongoose";
const { Schema } = mongoose;

const LeavesSchema = new Schema(
  {
    leaveType: {
      type: String,
      required: true,
    },
    dateRange: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
    documente: {
      type: String,
      required: false,
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const LeavesModel = mongoose.model("Leaves", LeavesSchema);
export default LeavesModel;
