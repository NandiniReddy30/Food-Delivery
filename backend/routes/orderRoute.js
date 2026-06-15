import express from "express";
import { createOrder, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/razorpay", createOrder);
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
