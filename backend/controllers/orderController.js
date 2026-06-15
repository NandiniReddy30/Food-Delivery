import orderModel from "../models/orderModel.js";
import Razorpay from "razorpay";

console.log("API HIT");
const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount, address, userId } = req.body;

    if (!address || !userId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const newOrder = new orderModel({
      userId,
      address,
      amount,
      payment: false,
    });

    const savedOrder = await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
    });

    res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

export { createOrder, verifyOrder };
