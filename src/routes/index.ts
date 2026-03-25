import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.routes";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/user/user.route";

const router = Router();

// Authentication
router.use("/auth", authRoutes);

// Speciality
router.use("/speciality", specialityRoutes);

// Doctor
router.use("/doctor", userRoutes);

export const indexRoutes = router;
