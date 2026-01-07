import express from"express"
import { create, filter, list, remove, update, upload } from "../controllers/foodController.js";

const foodRoute = express.Router()

foodRoute.post("/upload",upload)
foodRoute.post("/create", create)
foodRoute.get("/list", list )
foodRoute.delete("/remove/:id",remove)
foodRoute.put("/update",update)
foodRoute.get("/filter/:foodType", filter)


export default foodRoute;