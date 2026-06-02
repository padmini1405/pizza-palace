import Order from "../models/Order.js";

//CREATE ORDER 

export const createOrder = async (req, res) => {
    try {

        const { items, totalAmount, deliveryAddress } = req.body;

        const order = await Order.create({
            customerId: req.user._id,
            items,
            totalAmount,
            deliveryAddress,
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//GET ALL ORDER

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customerId")
            .populate("items.pizza")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//GET MY ORDER 

export const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            customerId: req.user._id,
        }).populate("items.pizza");

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//UPDATE ORDER 

export const updateOrderStatus = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.status = req.body.status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//CANCEL ORDER 

export const cancelOrder = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // CUSTOMER CAN CANCEL ONLY THEIR ORDER
        if (
            req.user.role !== "admin" &&
            order.customerId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // ONLY PENDING ORDER CAN BE CANCELLED
        if (order.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled",
            });
        }
        await order.deleteOne();
        
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};