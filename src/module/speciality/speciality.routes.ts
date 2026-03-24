import { Router } from "express";
import { specialityController } from "./speciality.controller";

const router = Router();

router.post("/", specialityController.addSpeciality);

router.get("/", specialityController.getSpecialities);

router.put("/:specialityId", specialityController.updateSpeciality);

router.delete("/:specialityId", specialityController.deleteSpeciality);

export const specialityRoutes = router;
