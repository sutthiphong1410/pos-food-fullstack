import express from "express";
import { create, list, remove, update } from "../controllers/foodTypeController.js";

const foodTypeRouter = express.Router();

foodTypeRouter.post("/create", create);
foodTypeRouter.get("/list", list);
foodTypeRouter.delete("/remove/:id", remove);
foodTypeRouter.put("/update/:id", update);

export default foodTypeRouter;