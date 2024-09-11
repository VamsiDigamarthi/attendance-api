import mongoose from "mongoose";
const { Schema } = mongoose;

const NAttendanceSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const NAttendanceModel = mongoose.model("NAttendance", NAttendanceSchema);
export default NAttendanceModel;
