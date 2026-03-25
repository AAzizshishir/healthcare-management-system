import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

// get all doctor
router.get("/", doctorController.getDoctors);

// get doctor by id
router.get("/:doctorId", doctorController.getDoctorById);

// update
router.put("/:doctorId", doctorController.updateDoctorData);

// update
router.delete("/:doctorId", doctorController.deleteDoctor);

export const doctorRoutes = router;
