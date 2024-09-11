import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { ensureSuperAdmin } from "../Middlewares/SuperAdminMiddleware.js";
import {
  allFetchAllEmployeesInSpecificCompany,
  onFetchNotApprovedEmployeesInSpecificCompany,
  onGivenApprovalSpecificEmployeesInSpecificCompany,
  updateUserPermissions,
} from "../Controllers/SuperAdmin.js";

const router = express.Router();

router.get(
  "/all-employees",
  authenticateToken,
  CheckingUser,
  ensureSuperAdmin,
  allFetchAllEmployeesInSpecificCompany
);

router.get(
  "/not-approved-employees",
  authenticateToken,
  CheckingUser,
  ensureSuperAdmin,
  onFetchNotApprovedEmployeesInSpecificCompany
);

router.patch(
  "/give-approval/:empId",
  authenticateToken,
  CheckingUser,
  ensureSuperAdmin,
  onGivenApprovalSpecificEmployeesInSpecificCompany
);

router.patch(
  "/permissions/:empId",
  authenticateToken,
  CheckingUser,
  ensureSuperAdmin,
  updateUserPermissions
);

export default router;
