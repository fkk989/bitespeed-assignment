import { Router } from "express";
import { handleIdentityPost } from "@/handlers/identify";
export const identifyRouter = Router();

identifyRouter.post("/", handleIdentityPost);
