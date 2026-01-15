import express from "express";
import { create, getLevelByToken, list, login, remove, update } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/create", create);
userRouter.get("/list",list)
userRouter.put("/update", update);
userRouter.delete("/remove/:id",remove );
userRouter.get('/getLevelByToken',getLevelByToken)

export default userRouter;
