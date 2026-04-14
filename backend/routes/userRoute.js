import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Register Route
userRouter.post("/register", registerUser);

// Login Route (optional for now)
userRouter.post("/login", loginUser);

export default userRouter;
