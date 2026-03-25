import express, { Application } from "express";
import cors from "cors";
import { indexRoutes } from "./routes";
import { envVariables } from "./config/env";

const app: Application = express();

app.use(
  cors({
    origin: envVariables.APP_URL || "http://localhose:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1", indexRoutes);

export default app;
