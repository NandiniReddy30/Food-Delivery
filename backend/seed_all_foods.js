import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://greatstack:8019491813@cluster0.hqvpojl.mongodb.net/FoodDelivery";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

const Food = mongoose.models.foods || mongoose.model("foods", foodSchema);

const seedData = [
  { name: "Greek salad", searchName: /Greek Salad/i, price: "12", category: "Salad", image: "food_1.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg salad", searchName: /Veg sal[a-z]+/i, price: "18", category: "Salad", image: "food_2.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Clover Salad", searchName: /Clover salad/i, price: "16", category: "Salad", image: "food_3.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Salad", searchName: /Chicken salad/i, price: "24", category: "Salad", image: "food_4.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Lasagna Rolls", searchName: /Lasagna Rolls/i, price: "14", category: "Rolls", image: "food_5.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Peri Peri Rolls", searchName: /Peri Peri Rolls/i, price: "12", category: "Rolls", image: "food_6.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Rolls", searchName: /Chicken Rolls/i, price: "20", category: "Rolls", image: "food_7.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Rolls", searchName: /Veg Rolls/i, price: "15", category: "Rolls", image: "food_8.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Ripple Ice Cream", searchName: /Ripple Ice[- ]cream/i, price: "14", category: "Deserts", image: "food_9.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fruit Ice Cream", searchName: /Fruit ice[- ]cream/i, price: "22", category: "Deserts", image: "food_10.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Jar Ice Cream", searchName: /Jar Ice[- ]cream/i, price: "10", category: "Deserts", image: "food_11.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vanilla Ice Cream", searchName: /Vanilla ice[- ]cream/i, price: "12", category: "Deserts", image: "food_12.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Sandwich", searchName: /Chicken Sandwich/i, price: "12", category: "Sandwich", image: "food_13.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Sandwich", searchName: /Vegan Sandwich/i, price: "18", category: "Sandwich", image: "food_14.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Grilled Sandwich", searchName: /Grilled Sandwich/i, price: "16", category: "Sandwich", image: "food_15.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Bread Sandwich", searchName: /Bread Sandwich/i, price: "24", category: "Sandwich", image: "food_16.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cup Cake", searchName: /Cup Cake/i, price: "14", category: "Cake", image: "food_17.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Cake", searchName: /Vegan Cake/i, price: "12", category: "Cake", image: "food_18.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Butterscotch Cake", searchName: /Butterscotch Cake/i, price: "20", category: "Cake", image: "food_19.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Sliced Cake", searchName: /Sliced Cake/i, price: "15", category: "Cake", image: "food_20.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Garlic Mushroom ", searchName: /Garlic Mushroom/i, price: "14", category: "Pure Veg", image: "food_21.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fried Cauliflower", searchName: /Fried Cauliflower/i, price: "22", category: "Pure Veg", image: "food_22.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Mix Veg Pulao", searchName: /Mix Veg Pulao/i, price: "10", category: "Pure Veg", image: "food_23.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Rice Zucchini", searchName: /Rice Zucchini/i, price: "12", category: "Pure Veg", image: "food_24.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cheese Pasta", searchName: /Cheese Pasta/i, price: "12", category: "Pasta", image: "food_25.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Tomato Pasta", searchName: /Tomato Pasta/i, price: "18", category: "Pasta", image: "food_26.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Creamy Pasta", searchName: /Creamy Pasta/i, price: "16", category: "Pasta", image: "food_27.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Pasta", searchName: /Chicken Pasta/i, price: "24", category: "Pasta", image: "food_28.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Buttter Noodles", searchName: /Buttter Noodles/i, price: "14", category: "Noodles", image: "food_29.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Noodles", searchName: /Veg Noodles/i, price: "12", category: "Noodles", image: "food_30.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Somen Noodles", searchName: /Somen Noodles/i, price: "20", category: "Noodles", image: "food_31.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cooked Noodles", searchName: /Cooked Noodles/i, price: "15", category: "Noodles", image: "food_32.png", description: "Food provides essential nutrients for overall health and well-being" }
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    for (const foodItem of seedData) {
      const existing = await Food.findOne({ name: foodItem.searchName });
      if (existing) {
        existing.name = foodItem.name;
        existing.price = foodItem.price;
        existing.category = foodItem.category;
        existing.image = foodItem.image;
        await existing.save();
        console.log(`Updated: ${foodItem.name}`);
      } else {
        const newFood = new Food({
          name: foodItem.name,
          description: foodItem.description,
          price: foodItem.price,
          category: foodItem.category,
          image: foodItem.image
        });
        await newFood.save();
        console.log(`Inserted: ${foodItem.name}`);
      }
    }
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
