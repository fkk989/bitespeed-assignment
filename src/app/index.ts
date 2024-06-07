import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { identifyRouter } from "@/routers";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import path from "path";

dotenv.config();
const app = express();
app.use(cors(), bodyParser.json());

// swagger yml file
const swaggerDocument = yaml.load(
  path.resolve(__dirname, "../../swagger/swagger.yml")
);
// server swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/identify", identifyRouter);

// healthCheck
app.get("/api/health", (req, res) => {
  return res
    .json({
      message: "server running fine",
    })
    .status(200);
});

export default app;
