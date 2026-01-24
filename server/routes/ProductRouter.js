const express = require("express");
const router = express.Router();
const productModel = require("../models/product");
const {
  createProductController,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// @/products/api
// @desc fetch all the products

router.get("/", async (req, res) => {
  try {
    const allProducts = await productModel.find();
    if (allProducts) {
      res.status(200).json(allProducts);
    } else {
      re.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = {
        $in: category.split(","),
      };
    }

    if (material && material.toLowerCase() !== "all") {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.size = { $in: size.split(",") };
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = {
        $in: category.split(","),
      };
    }
    if (color) {
      query.color = { $in: color.split(",") };
    }
    if (gender) {
      query.gender = { $regex: gender, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
        { metaDescription: { $regex: search, $options: "i" } },
        { metaKeywords: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;

        case "priceDesc":
          sort = { price: -1 };
          break;

        case "popularity":
          sort = { rating: -1 };
          break;

        case "newest":
          sort = { createdAt: -1 };
          break;

        default:
          break;
      }
    }

    let products = await productModel
      .find({ ...query, isPublished: true }) // merge your existing query with isPublished filter
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await productModel.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.status(200).json(bestSeller);
    } else {
      return res.status(404).json({ message: "No best-seller found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error", error);
  }
});

router.get("/women-collection", async (req, res) => {
  try {
    const womenProducts = await productModel
      .find({ gender: "female" })
      .limit(8);
    if (womenProducts && womenProducts.length > 0) {
      res.status(200).json(womenProducts);
    } else {
      return res.status(404).json({ message: "No women's collection found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

// Men's Collection Route
router.get("/men-collection", async (req, res) => {
  try {
    const menProducts = await productModel.find({ gender: "male" }).limit(8);
    if (menProducts && menProducts.length > 0) {
      res.status(200).json(menProducts);
    } else {
      return res.status(404).json({ message: "No men's collection found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(8);
    if (newArrivals) {
      res.status(200).json(newArrivals);
    } else {
      return res.status(404).json({ message: "No New Arrivals found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error", error);
  }
});

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const similarProducts = await productModel.find({
      _id: { $ne: id }, // Exclude the current product
      gender: product.gender,
      category: product.category,
    });
    res.status(200).json(similarProducts).limit(4);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error", error);
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const productData = await productModel.findById(id);
    if (productData) {
      res.status(200).json(productData);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
