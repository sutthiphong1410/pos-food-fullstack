import express from "express"
import { create, list } from "../controllers/saleTempController.js"
const saleRouter = express.Router()

saleRouter.post("/create",create)
saleRouter.get("/list",list)

export default saleRouter