import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

// Create User
router.post("/register", userController.createUser);

// Login User
router.post("/login", userController.loginUser);

export const authRoutes = router;
