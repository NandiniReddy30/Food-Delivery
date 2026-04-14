import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://greatstack:8019491813@cluster0.hqvpojl.mongodb.net/FoodDelivery",
      )
      .then(() => console.log("DB Connected"));
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};
