import Pizza from "../models/Pizza.js";
import cloudinary from "../config/cloudinary.js";


// CREATE PIZZA 
export const createPizza = async (req, res) => {

  try {
    //Image Check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    // Convert BUFFER TO BASE64
    const fileBase64 =
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary

    const uploadedImage =
      await cloudinary.uploader.upload(
        fileBase64,
        {
          folder: "pizza-palace",
        }
      );

    //Create Pizza 
    const pizza = await Pizza.create({
      name: req.body.name,

      description:
        req.body.description,

      category: req.body.category,

      imageUrl:
        uploadedImage.secure_url,

      sizes: JSON.parse(req.body.sizes),
    });

    res.status(201).json({
      success: true,
      message: "Pizza Created Successfully",
      pizza,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};


// GET ALL PIZZA 
export const getAllPizza = async (req, res) => {
  try {
    const pizza = await Pizza.find();

    res.status(200).json({
      success: true,
      pizza,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }

}

// GET SINGLE PIZZA 

export const getSinglePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      pizza,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//UPDATE PIZZA 

export const updatePizza = async (req, res) => {
  try {

    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    // TEXT FIELDS
    pizza.name =
      req.body.name || pizza.name;

    pizza.description =
      req.body.description || pizza.description;

    pizza.category =
      req.body.category || pizza.category;

    // STATUS TOGGLE
    if (req.body.isAvailable !== undefined) {
      pizza.isAvailable = req.body.isAvailable;
    }

    // SIZES
    if (req.body.sizes) {
      pizza.sizes =
        JSON.parse(req.body.sizes);
    }

    // IMAGE UPDATE
    if (req.file) {

      const fileBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadedImage =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder: "pizza-palace",
          }
        );

      pizza.imageUrl =
        uploadedImage.secure_url;
    }

    await pizza.save();

    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      pizza,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//DELETE PIZZA 

export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

