import UserModel from "../Modals/AuthModal.js";

export const allFetchAllEmployeesInSpecificCompany = async (req, res) => {
  const { user } = req;

  try {
    const allEmployeesInSpecificCompany = await UserModel.find(
      {
        companyName: user.companyName,
      },
      "-password -createdAt -updatedAt -__v"
    );
    return res.status(200).json(allEmployeesInSpecificCompany);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Fetch all employees in specific company failed",
    });
    return res.status(500).json({
      message: "Fetch all employees in specific company failed",
      error: error.message,
    });
  }
};

export const onFetchNotApprovedEmployeesInSpecificCompany = async (
  req,
  res
) => {
  const { user } = req;
  try {
    if (user?.role === "SuperAdmin" || user.role === "Admin") {
      const notApprovedEmployeesInSpecificCompany = await UserModel.find({
        companyName: user.companyName,
        isApprovated: false,
      });
      return res.status(200).json(notApprovedEmployeesInSpecificCompany);
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
  } catch (error) {
    console.log({
      error: error.message,
      message: "fetch all not approved employees in specific company failed",
    });
    return res.status(500).json({
      message: "Fetch all not approved employees in specific company failed",
      error: error.message,
    });
  }
};

export const onGivenApprovalSpecificEmployeesInSpecificCompany = async (
  req,
  res
) => {
  const { user } = req;
  const { empId } = req.params;
  const { isApprovated } = req.body;
  try {
    // console.log(empId);
    // console.log(user);
    if (user?.role === "SuperAdmin" || user.role === "Admin") {
      const updatedEmployee = await UserModel.findOneAndUpdate(
        { _id: empId, companyName: user.companyName },
        { isApprovated: isApprovated },
        { new: true }
      );
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      return res
        .status(200)
        .json({ message: "approval updated successfully..!", updatedEmployee });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
  } catch (error) {
    console.log({
      error: error.message,
      message: "onGivenApproval specific employees in specific company failed",
    });
    return res.status(500).json({
      message:
        "On given approval specific employees in specific company failed",
      error: error.message,
    });
  }
};

export const updateUserPermissions = async (req, res) => {
  const { empId } = req.params;

  try {
    // Find the user by empId and update the permissions
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: empId }, // Filter by empId
      { $set: { permissions: req.body } }, // Update the permissions
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        empId: updatedUser.empId,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        permissions: updatedUser.permissions,
      },
      message: "Permissions updated successfully",
    });
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to update permissions",
    });
    return res.status(500).json({ message: "Failed to update permissions" });
  }
};

export const onFindHrs = async (req, res) => {
  const { user } = req;
  try {
    const hrs = await UserModel.find(
      {
        companyName: user.companyName,
        role: "Admin",
      },
      "-password -createdAt -updatedAt -__v"
    );
    return res.status(200).json(hrs);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to find hrs",
    });
    return res.status(500).json({ message: "Failed to find hrs" });
  }
};
