import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createDoctor);

export const userRoutes = router;
