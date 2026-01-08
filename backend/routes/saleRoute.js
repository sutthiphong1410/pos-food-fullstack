import express from "express"
import { create, generateSaleTempDetail, info, list, remove, removeAll, updateQty } from "../controllers/saleTempController.js"
const saleRouter = express.Router()

saleRouter.post("/create",create)
saleRouter.get("/list",list)
saleRouter.delete("/remove/:id", remove)
saleRouter.delete("/removeAll", removeAll)
saleRouter.put("/updateQty",updateQty)
saleRouter.post("/generateSaleTempDetail",generateSaleTempDetail)
saleRouter.get("/info/:id",info)

export default saleRouter