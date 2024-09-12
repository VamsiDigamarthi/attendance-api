import NAttendanceModel from "../Modals/AttendanceModal.js";

export const onPostAttendance = async (req, res) => {
  const { user } = req;
  const { date, startTime, longitude, latitude, address } = req.body;
  console.log(date);
  try {
    const existingAttendance = await NAttendanceModel.findOne({
      head: user._id,
      date,
      startTime,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already added for this date and time" });
    }

    const attendance = new NAttendanceModel({
      head: user._id,
      date,
      startTime,
      longitude,
      latitude,
      address,
    });
    const savedAttendance = await attendance.save();

    // Convert the Mongoose document to a plain JavaScript object
    const attendanceObj = savedAttendance.toObject();

    // Remove the fields you don't want to include in the response
    delete attendanceObj.head;
    delete attendanceObj.createdAt;
    delete attendanceObj.updatedAt;
    return res.status(201).json({
      attendance: attendanceObj,
      message: "save attendance successfully",
    });
  } catch (error) {
    console.log({ error: error.message, message: "Failed to save attendance" });
    return res.status(500).json({ message: "Failed to save attendance" });
  }
};

export const onUpdateAttendanceEndTime = async (req, res) => {
  const { user } = req;
  const { date, endTime, longitude, latitude, address } = req.body;

  try {
    // Find the attendance record for the given date and start time
    const attendance = await NAttendanceModel.findOneAndUpdate(
      {
        head: user._id,
        date,
      },
      { endTime, longitude, latitude, address }, // Update the end time
      { new: true } // Return the updated document
    ).select("-createdAt -updatedAt -__v -head"); // Exclude createdAt and updatedAt fields

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json({
      attendance,
      message: "End time updated successfully",
    });
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to update attendance end time",
    });
    return res
      .status(500)
      .json({ message: "Failed to update attendance end time" });
  }
};

export const onGetAttendance = async (req, res) => {
  const { user } = req;
  try {
    const attendance = await NAttendanceModel.find({ head: user._id })
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt -__v -head");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Fetching Attendance failed",
    });
    return res.status(500).json({ message: "Fetching attendance failed" });
  }
};

export const onMonthWiseAttendance = async (req, res) => {
  const { user } = req;
  const { year, month } = req.params;
  console.log(year, month);
  const monthInt = parseInt(month, 10);
  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ message: "Invalid month value" });
  }

  const startDate = new Date(Number(year), monthInt - 1, 1);
  const endDate = new Date(Number(year), monthInt, 1);

  try {
    const attendance = await NAttendanceModel.find({
      head: user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ date: 1 })
      .select("-createdAt -updatedAt -__v -head");

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this month" });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching month-wise attendance:", error.message);
    return res.status(500).json({
      message: "Failed to fetch month-wise attendance",
      error: error.message,
    });
  }
};

export const onGetAttendanceByDate = async (req, res) => {
  const { user } = req;
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    // Convert date string to Date object and set time to the start of the day
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Set to the next day to cover the entire day

    // Find attendance record within the start and end date range
    const attendance = await NAttendanceModel.findOne({
      head: user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).select("-createdAt -updatedAt -__v -head");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to get Attendance by date",
    });
    return res
      .status(500)
      .json({ message: "Failed to get Attendance by date" });
  }
};
