import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Create Doctor
router.post(
  "/register-doctor",
  authMiddleware(Role.ADMIN),
  userController.createDoctor,
);

// Create Admin
router.post("/register-admin", userController.createAdmin);

export const userRoutes = router;
