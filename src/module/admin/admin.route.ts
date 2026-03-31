import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Get All Admin Api
router.get(
  "/",
  authMiddleware(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.getAllAdmins,
);

// Get Specific Admin Api
router.get(
  "/:adminId",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAdminById,
);

router.patch(
  "/:id",
  authMiddleware(Role.SUPER_ADMIN),
  adminController.updateAdmin,
);

export const adminRoutes = router;
