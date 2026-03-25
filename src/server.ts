import app from "./app";
import { envVariables } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    app.get("/", (req, res) => {
      res.send("HealthCare Management system");
    });

    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(envVariables.PORT, () => {
      console.log(`Server is running on ${envVariables.PORT}`);
    });
  } catch (error) {
    console.error("an error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
