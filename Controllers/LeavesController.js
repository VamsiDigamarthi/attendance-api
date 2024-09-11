import LeavesModel from "../Modals/LeavesModal.js";

export const onApplyLeaves = async (req, res) => {
  const { user } = req;
  const { leaveType, dateRange, reason } = req.body;
  try {
    const leaveApplication = new LeavesModel({
      leaveType,
      dateRange,
      reason,
      head: user._id,
      documente: req.file ? req.file.path : null,
    });
    const savedLeaveApplication = await leaveApplication.save();

    const leaveObj = savedLeaveApplication.toObject();

    delete leaveObj.createdAt;
    delete leaveObj.updatedAt;
    delete leaveObj.__v;
    delete leaveObj.head;

    return res.status(201).json({
      leaveApplication: leaveObj,
      message: "Leave application submitted successfully",
    });
  } catch (error) {
    console.log({ error: error.message, message: "ApplyLeaves failed" });
    return res
      .status(500)
      .json({ error: error.message, message: "ApplyLeaves failed" });
  }
};

export const onGetLeaves = async (req, res) => {
  const { user } = req;
  try {
    const leaveApplications = await LeavesModel.find({ head: user._id }).select(
      "-createdAt -updatedAt -__v -head"
    );
    return res.status(200).json(leaveApplications);
  } catch (error) {
    console.log({ error: error.message, message: "GET ApplyLeaves failed" });
    return res
      .status(500)
      .json({ error: error.message, message: "GET Apply Leaves failed" });
  }
};
