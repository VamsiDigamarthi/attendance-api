import LeavesModel from "../Modals/LeavesModal.js";

export const onChangeLeavesStatus = async (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body;
  const { user } = req;
  try {
    // Get the leave document from the database

    if (!["SuperAdmin", "Admin"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this feature" });
    }

    // Validate the status
    const validStatuses = ["Pending", "Approved", "Denied"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await LeavesModel.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.status(200).json({
      message: "Status changed successfully",
      leave: {
        _id: leave._id,
        status: leave.status,
      },
    });
  } catch (error) {
    console.log({
      error: error.message,
      message: "change leaves status failed",
    });
    return res.status(500).json({ message: "change leaves status failed" });
  }
};
