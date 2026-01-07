import express from "express";
import { create, list, remove, update } from "../controllers/foodSizeController.js";

const foodSizeRoute = express.Router();

foodSizeRoute.post("/create", create);
foodSizeRoute.get("/list", list)
foodSizeRoute.delete("/remove/:id", remove);
foodSizeRoute.put("/update", update);


export default foodSizeRoute;

