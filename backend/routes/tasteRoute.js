import express from "express";
import { create, list, remove, update } from "../controllers/tasteController.js";

const tasteRouter = express.Router();

tasteRouter.post("/create",create)
tasteRouter.get("/list",list)
tasteRouter.delete("/remove/:id",remove)
tasteRouter.put("/update/:id",update)

export default tasteRouter;