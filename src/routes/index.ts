import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.routes";
import { authRoutes } from "../module/auth/auth.routes";

const router = Router();

// Authentication
router.use("/auth", authRoutes);

// Speciality
router.use("/speciality", specialityRoutes);

export const indexRoutes = router;
