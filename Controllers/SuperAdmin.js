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
    const notApprovedEmployeesInSpecificCompany = await UserModel.find({
      companyName: user.companyName,
      isApprovated: false,
    });
    return res.status(200).json(notApprovedEmployeesInSpecificCompany);
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
  try {
    const updatedEmployee = await UserModel.findOneAndUpdate(
      { empId: empId, companyName: user.companyName },
      { isApprovated: true },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res
      .status(200)
      .json({ message: "approval updated successfully..!", updatedEmployee });
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
      { empId }, // Filter by empId
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
