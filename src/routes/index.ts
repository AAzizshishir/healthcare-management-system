import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.routes";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";

const router = Router();

// Authentication
router.use("/auth", authRoutes);

// Speciality
router.use("/speciality", specialityRoutes);

// User
router.use("/user", userRoutes);

// Doctor
router.use("/doctor", doctorRoutes);

export const indexRoutes = router;
