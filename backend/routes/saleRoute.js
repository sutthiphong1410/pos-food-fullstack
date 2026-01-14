import express from "express"
import { create, createSaleTempDetail, 
    endSale, generateSaleTempDetail, info, list, 
    printBillAfterPay, 
    printBillBeforePay, 
    remove, removeAll, removeSaleTempDetail, selectSize, selectTaste, unSelectSize, 
    unSelectTaste, updateQty } from "../controllers/saleTempController.js"
    
const saleRouter = express.Router()

saleRouter.post("/create",create)
saleRouter.get("/list",list)
saleRouter.delete("/remove/:id", remove)
saleRouter.delete("/removeAll", removeAll)
saleRouter.put("/updateQty",updateQty)
saleRouter.post("/generateSaleTempDetail",generateSaleTempDetail)
saleRouter.get("/info/:id",info)
saleRouter.put("/selectTaste", selectTaste)
saleRouter.put("/unSelectTaste",unSelectTaste)
saleRouter.put("/selectSize", selectSize)
saleRouter.put("/unSelectSize", unSelectSize)
saleRouter.post("/createSaleTempDetail", createSaleTempDetail)
saleRouter.delete("/removeSaleTempDetail", removeSaleTempDetail)
saleRouter.post('/printBillBeforePay', printBillBeforePay);
saleRouter.post('/endSale', endSale);
saleRouter.post('/printBillAfterPay', printBillAfterPay);

export default saleRouter