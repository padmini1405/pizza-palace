import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["veg", "non-veg", "speciality", "combo"],
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        sizes: [
            {
                size: {
                    type: String,
                    enum: ["Small", "Medium", "Large"],
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                    min:0,
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;