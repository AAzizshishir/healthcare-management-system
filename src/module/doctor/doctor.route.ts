import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// get all doctor
router.get("/", authMiddleware(Role.ADMIN), doctorController.getDoctors);

// get doctor by id
router.get(
  "/:doctorId",
  authMiddleware(Role.DOCTOR, Role.ADMIN),
  doctorController.getDoctorById,
);

// update
router.put(
  "/:doctorId",
  authMiddleware(Role.DOCTOR, Role.ADMIN),
  doctorController.updateDoctorData,
);

// update
router.delete(
  "/:doctorId",
  authMiddleware(Role.DOCTOR, Role.ADMIN),
  doctorController.deleteDoctor,
);

export const doctorRoutes = router;
