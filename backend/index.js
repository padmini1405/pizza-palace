import "./config/env.js";

console.log("ENV CHECK");
// console.log(process.env.CLOUDINARY_API_KEY);

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.use("/api/pizzas", pizzaRoutes);
    
app.use("/api/orders", orderRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running in port ${PORT}`);
});

app.get("/",(req, res)=>{
    res.send("Backend is running...")
})

