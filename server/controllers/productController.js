const productModel = require("../models/product");

module.exports.createProductController = async (req, res) => {
  let {
    name,
    description,
    originalPrice,
    price,
    color,
    size,
    material,
    brand,
    gender,
    tags,
    dimension,
    isPublished,
    isFeatured,
    weight,
    category,
    images,
  } = req.body;

  try {
    if (
      !(name,
      originalPrice,
      description,
      color,
      size,
      material,
      brand,
      gender,
      category,
      images)
    ) {
      return res.status(400).send("All the fields are compulsarily required");
    }
    const isProductExist = await productModel.findOne({ name });

    if (isProductExist) {
      return res.status(404).send("Product with this name already exists");
    }

    const createdProduct = await productModel.create({
      name,
      description,
      originalPrice,
      price,
      color,
      size,
      material,
      brand,
      gender,
      tags,
      dimension,
      isPublished,
      isFeatured,
      weight,
      category,
      images,
      user: req.user._id,
    });
    if (createdProduct) {
      res.json({
        message: `Product successfully created by the admin ${req.user.name}`,
        createdProduct,
      });
    } else {
      return res.send(404).send("Error creating product");
    }
  } catch (error) {
    console.log("Error faced:", error);
    return res.status(500).send("Error occured");
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      originalPrice,
      price,
      color,
      size,
      material,
      brand,
      gender,
      tags,
      dimension,
      isPublished,
      isFeatured,
      weight,
      category,
      images,
    } = req.body;

    const product = await productModel.findById(req.params.id);
    if (product) {
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        {
          name: name || product.name,
          description: description || product.description,
          originalPrice: originalPrice || product.originalPrice,
          price: price || product.price,
          color: color || product.color,
          size: size || product.size,
          material: material || product.material,
          brand: brand || product.brand,
          gender: gender || product.gender,
          tags: tags || product.tags,
          dimension: dimension || product.dimension,
          isPublished:
            isPublished !== undefined ? isPublished : product.isPublished,
          isFeatured:
            isFeatured !== undefined ? isFeatured : product.isFeatured,
          weight: weight || product.weight,
          category: category || product.category,
          images: images || product.images,
        }
      );
      if (updatedProduct) {
        res
          .status(201)
          .json({ message: "Product Successfully Updated", updatedProduct });
      }
    } else {
      console.log("No product found");
      res.status(404).json({ message: "Product not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error", error);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await productModel.deleteOne({ _id: id });
    if (deleteProduct) {
      res.status(201).json({ message: "Product Deleted", deleteProduct });
    } else {
      return res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error", error);
  }
};
