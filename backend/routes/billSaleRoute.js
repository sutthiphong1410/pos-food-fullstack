import express from "express";
import { list, remove } from "../controllers/billSaleController.js";

const billSaleRoute = express.Router();

billSaleRoute.post("/list",list)
billSaleRoute.delete("/remove/:id",remove)


export default billSaleRoute;