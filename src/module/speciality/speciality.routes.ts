import { Router } from "express";
import { specialityController } from "./speciality.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./speciality.validate";

const router = Router();

router.post(
  "/",
  //   authMiddleware(Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
  specialityController.addSpeciality,
);

router.get("/", specialityController.getSpecialities);

router.put("/:specialityId", specialityController.updateSpeciality);

router.delete("/:specialityId", specialityController.deleteSpeciality);

export const specialityRoutes = router;
