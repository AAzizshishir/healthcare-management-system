import express, { Application } from "express";
import cors from "cors";
import { specialityRoutes } from "./module/speciality/speciality.routes";
import { indexRoutes } from "./routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhose:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1", indexRoutes);

export default app;
