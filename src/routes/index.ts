import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.routes";

const router = Router();

router.use("/speciality", specialityRoutes);

export const indexRoutes = router;
