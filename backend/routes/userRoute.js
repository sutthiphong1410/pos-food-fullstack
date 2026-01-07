import express from "express";
import { login } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);

export default userRouter;
