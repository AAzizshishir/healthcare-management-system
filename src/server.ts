import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    app.get("/", (req, res) => {
      res.send("HealthCare Management system");
    });

    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("an error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
