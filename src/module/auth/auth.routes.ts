import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// Create User
router.post("/register", authController.createUser);

// Login User
router.post("/login", authController.loginUser);

export const authRoutes = router;
