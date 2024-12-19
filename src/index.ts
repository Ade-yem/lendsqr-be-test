import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mainRouter from "./route/index";

config();
export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", mainRouter);

app.listen(5000, async () => {
  console.log(`Server listening on port 5000`);
});
