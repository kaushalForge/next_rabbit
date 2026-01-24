const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

const downloadImage = require("./downloadImage.js");
// ---------------- CONFIG ----------------

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// ---------------- HELPERS ----------------
// async function downloadImage(url, filename) {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed to download image: ${url}`);
//   const buffer = await res.buffer();
//   const filePath = path.join(TEMP_DIR, filename);
//   fs.writeFileSync(filePath, buffer);
//   return filePath;
// }

// ---------------- PRODUCTS ----------------
// const products = [
//   // ---------- TOP WEAR ----------
//   {
//     name: "Men White Slim Fit Shirt",
//     description:
//       "Formal slim-fit white shirt made with breathable cotton blend, perfect for office and events.",
//     originalPrice: 55,
//     price: 42,
//     color: ["White"],
//     size: ["S", "M", "L", "XL"],
//     material: ["Cotton Blend"],
//     brand: ["Formale"],
//     gender: "male",
//     category: "Top Wear",
//     tags: ["shirt", "formal", "men"],
//     isFeatured: true,
//     isPublished: true,
//     weight: "300g",
//     stock: 90,
//     dimensions: { length: "74cm", width: "54cm", height: "2cm" },
//     metaTitle: "Men White Slim Fit Formal Shirt",
//     metaDescription:
//       "Premium white slim fit shirt for men, ideal for office and formal occasions.",
//     metaKeywords: "men white shirt, slim fit shirt, formal wear",
//     images: [
//       "https://images.unsplash.com/photo-1603252109303-2751441dd157",
//       "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
//     ],
//   },

//   {
//     name: "Women Floral Summer Top",
//     description:
//       "Lightweight floral printed top designed for comfort and summer fashion.",
//     originalPrice: 45,
//     price: 32,
//     color: ["Floral"],
//     size: ["S", "M", "L"],
//     material: ["Rayon"],
//     brand: ["BloomWear"],
//     gender: "female",
//     category: "Top Wear",
//     tags: ["top", "summer", "women"],
//     isFeatured: false,
//     isPublished: true,
//     weight: "220g",
//     stock: 110,
//     dimensions: { length: "62cm", width: "48cm", height: "2cm" },
//     metaTitle: "Women Floral Summer Top",
//     metaDescription:
//       "Stylish floral summer top for women with breathable lightweight fabric.",
//     metaKeywords: "women summer top, floral top, casual wear",
//     images: [
//       "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
//       "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
//     ],
//   },

//   {
//     name: "Unisex Black Oversized T-Shirt",
//     description:
//       "Trendy oversized t-shirt crafted for streetwear fashion and comfort.",
//     originalPrice: 35,
//     price: 25,
//     color: ["Black"],
//     size: ["M", "L", "XL"],
//     material: ["Cotton"],
//     brand: ["StreetLab"],
//     gender: "unisex",
//     category: "Top Wear",
//     tags: ["oversized", "streetwear", "tshirt"],
//     isFeatured: true,
//     isPublished: true,
//     weight: "280g",
//     stock: 150,
//     dimensions: { length: "76cm", width: "60cm", height: "2cm" },
//     metaTitle: "Unisex Black Oversized T-Shirt",
//     metaDescription:
//       "Black oversized unisex t-shirt for modern streetwear looks.",
//     metaKeywords: "oversized t-shirt, unisex wear, street fashion",
//     images: [
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
//       "https://images.unsplash.com/photo-1618354691438-25bc04584c23",
//     ],
//   },

//   // ---------- BOTTOM WEAR ----------
//   {
//     name: "Men Slim Fit Chinos",
//     description:
//       "Comfortable slim-fit chinos suitable for office and casual outings.",
//     originalPrice: 70,
//     price: 55,
//     color: ["Beige"],
//     size: ["30", "32", "34", "36"],
//     material: ["Cotton Twill"],
//     brand: ["UrbanForm"],
//     gender: "male",
//     category: "Bottom Wear",
//     tags: ["chinos", "men pants", "casual"],
//     isFeatured: false,
//     isPublished: true,
//     weight: "650g",
//     stock: 85,
//     dimensions: { length: "102cm", width: "42cm", height: "3cm" },
//     metaTitle: "Men Beige Slim Fit Chinos",
//     metaDescription:
//       "Premium beige chinos for men with slim fit and all-day comfort.",
//     metaKeywords: "men chinos, slim fit pants, beige trousers",
//     images: [
//       "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
//       "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
//     ],
//   },

//   {
//     name: "Women High Waist Black Trousers",
//     description:
//       "Elegant high-waist trousers designed for formal and semi-formal wear.",
//     originalPrice: 75,
//     price: 58,
//     color: ["Black"],
//     size: ["26", "28", "30", "32"],
//     material: ["Polyester Blend"],
//     brand: ["Elegance"],
//     gender: "female",
//     category: "Bottom Wear",
//     tags: ["trousers", "women pants", "formal"],
//     isFeatured: true,
//     isPublished: true,
//     weight: "600g",
//     stock: 70,
//     dimensions: { length: "104cm", width: "40cm", height: "3cm" },
//     metaTitle: "Women Black High Waist Trousers",
//     metaDescription:
//       "High waist black trousers for women with elegant tailored finish.",
//     metaKeywords: "women trousers, black pants, high waist",
//     images: [
//       "https://images.unsplash.com/flagged/photo-1585052201332-b8c0ce30972f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
//       "https://images.unsplash.com/photo-1556906781-9a412961c28c",
//     ],
//   },

//   {
//     name: "Unisex Grey Jogger Pants",
//     description:
//       "Soft and flexible joggers perfect for workouts and relaxed wear.",
//     originalPrice: 50,
//     price: 38,
//     color: ["Grey"],
//     size: ["M", "L", "XL"],
//     material: ["Cotton Fleece"],
//     brand: ["FlexWear"],
//     gender: "unisex",
//     category: "Bottom Wear",
//     tags: ["joggers", "sportswear", "casual"],
//     isFeatured: false,
//     isPublished: true,
//     weight: "550g",
//     stock: 130,
//     dimensions: { length: "98cm", width: "44cm", height: "3cm" },
//     metaTitle: "Unisex Grey Jogger Pants",
//     metaDescription:
//       "Comfortable grey jogger pants for unisex casual and athletic use.",
//     metaKeywords: "joggers, unisex pants, sportswear",
//     images: [
//       "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1",
//       "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
//     ],
//   },

//   // ---------- OUTERWEAR ----------
//   {
//     name: "Men Navy Blue Denim Jacket",
//     description:
//       "Classic denim jacket crafted for durability and timeless fashion.",
//     originalPrice: 110,
//     price: 85,
//     color: ["Navy Blue"],
//     size: ["M", "L", "XL"],
//     material: ["Denim"],
//     brand: ["DenimEdge"],
//     gender: "male",
//     category: "Top Wear",
//     tags: ["jacket", "denim", "men"],
//     isFeatured: true,
//     isPublished: true,
//     weight: "950g",
//     stock: 55,
//     dimensions: { length: "68cm", width: "58cm", height: "5cm" },
//     metaTitle: "Men Navy Blue Denim Jacket",
//     metaDescription: "Stylish navy blue denim jacket for men with classic fit.",
//     metaKeywords: "denim jacket, men jacket, navy blue",
//     images: [
//       "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126",
//       "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
//     ],
//   },

//   {
//     name: "Women Long Woolen Coat",
//     description:
//       "Warm woolen long coat designed for winter elegance and comfort.",
//     originalPrice: 150,
//     price: 120,
//     color: ["Camel"],
//     size: ["S", "M", "L"],
//     material: ["Wool Blend"],
//     brand: ["WinterLux"],
//     gender: "female",
//     category: "Top Wear",
//     tags: ["coat", "winter", "women"],
//     isFeatured: true,
//     isPublished: true,
//     weight: "1200g",
//     stock: 40,
//     dimensions: { length: "110cm", width: "55cm", height: "6cm" },
//     metaTitle: "Women Camel Woolen Long Coat",
//     metaDescription:
//       "Premium camel woolen long coat for women, perfect for winter wear.",
//     metaKeywords: "women coat, wool coat, winter fashion",
//     images: [
//       "https://images.unsplash.com/photo-1529636273736-fc88b31ea9d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRyZXNzfGVufDB8fDB8fHww",
//       "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
//     ],
//   },
// ];

const products = [
  // ---------- TOP WEAR ----------
  {
    name: "Men White Slim Fit Shirts",
    description:
      "Formal slim-fit white shirt made with breathable cotton blend, perfect for office and events.",
    originalPrice: 55,
    price: 42,
    offerPrice: 42,
    rating: 5,
    color: ["White"],
    size: ["S", "M", "L", "XL"],
    material: ["Cotton Blend"],
    brand: ["Formale"],
    gender: "male",
    category: "Top Wear",
    tags: ["shirt", "formal", "men"],
    isFeatured: true,
    isPublished: true,
    weight: "300g",
    stock: 90,
    dimensions: { length: "74cm", width: "54cm", height: "2cm" },
    metaTitle: "Men White Slim Fit Formal Shirt",
    metaDescription:
      "Premium white slim fit shirt for men, ideal for office and formal occasions.",
    metaKeywords: "men white shirt, slim fit shirt, formal wear",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    ],
  },

  {
    name: "Women Floral Summer Tops",
    description:
      "Lightweight floral printed top designed for comfort and summer fashion.",
    originalPrice: 45,
    price: 32,
    offerPrice: 32,
    rating: 4,
    color: ["Floral"],
    size: ["S", "M", "L"],
    material: ["Rayon"],
    brand: ["BloomWear"],
    gender: "female",
    category: "Top Wear",
    tags: ["top", "summer", "women"],
    isFeatured: false,
    isPublished: true,
    weight: "220g",
    stock: 110,
    dimensions: { length: "62cm", width: "48cm", height: "2cm" },
    metaTitle: "Women Floral Summer Top",
    metaDescription:
      "Stylish floral summer top for women with breathable lightweight fabric.",
    metaKeywords: "women summer top, floral top, casual wear",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
    ],
  },

  // ---------- BOTTOM WEAR ----------
  {
    name: "Men Slim Fit Chinos",
    description:
      "Comfortable slim-fit chinos suitable for office and casual outings.",
    originalPrice: 70,
    price: 55,
    offerPrice: 55,
    rating: 4,
    color: ["Beige"],
    size: ["30", "32", "34", "36"],
    material: ["Cotton Twill"],
    brand: ["UrbanForm"],
    gender: "male",
    category: "Bottom Wear",
    tags: ["chinos", "men pants", "casual"],
    isFeatured: false,
    isPublished: true,
    weight: "650g",
    stock: 85,
    dimensions: { length: "102cm", width: "42cm", height: "3cm" },
    metaTitle: "Men Beige Slim Fit Chinos",
    metaDescription:
      "Premium beige chinos for men with slim fit and all-day comfort.",
    metaKeywords: "men chinos, slim fit pants, beige trousers",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
      "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?w=600&auto=format&fit=crop&q=60",
    ],
  },

  {
    name: "Unisex Grey Jogger Pants",
    description:
      "Soft and flexible joggers perfect for workouts and relaxed wear.",
    originalPrice: 50,
    price: 38,
    offerPrice: 38,
    rating: 5,
    color: ["Grey"],
    size: ["M", "L", "XL"],
    material: ["Cotton Fleece"],
    brand: ["FlexWear"],
    gender: "unisex",
    category: "Bottom Wear",
    tags: ["joggers", "sportswear", "casual"],
    isFeatured: false,
    isPublished: true,
    weight: "550g",
    stock: 130,
    dimensions: { length: "98cm", width: "44cm", height: "3cm" },
    metaTitle: "Unisex Grey Jogger Pants",
    metaDescription:
      "Comfortable grey jogger pants for unisex casual and athletic use.",
    metaKeywords: "joggers, unisex pants, sportswear",
    images: [
      "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1",
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
    ],
  },

  // ---------- OUTERWEAR ----------
  {
    name: "Men Navy Blue Denim Jacket",
    description:
      "Classic denim jacket crafted for durability and timeless fashion.",
    originalPrice: 110,
    price: 85,
    offerPrice: 85,
    rating: 5,
    color: ["Navy Blue"],
    size: ["M", "L", "XL"],
    material: ["Denim"],
    brand: ["DenimEdge"],
    gender: "male",
    category: "Top Wear",
    tags: ["jacket", "denim", "men"],
    isFeatured: true,
    isPublished: true,
    weight: "950g",
    stock: 55,
    dimensions: { length: "68cm", width: "58cm", height: "5cm" },
    metaTitle: "Men Navy Blue Denim Jacket",
    metaDescription: "Stylish navy blue denim jacket for men with classic fit.",
    metaKeywords: "denim jacket, men jacket, navy blue",
    images: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    ],
  },
];

const API_URL = "http://localhost:4000/api/admin/products/add";

const ADMIN_COOKIE =
  "cUser=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJlbWFpbCI6ImluYm94LnJhYmJpdEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNzY5MjcwODYxLCJleHAiOjE3Njk0NDM2NjF9.Zv7u5MUEZwbZ_q-AyoUcyohe8hMpwHA-ncI_Pih6hGY";

const USER_ID = "67c9356829a8820a6a4985f5";

async function seedProducts() {
  for (const product of products) {
    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("originalPrice", String(product.originalPrice));
    form.append("price", String(product.price));
    form.append("rating", "0");
    form.append("gender", product.gender);
    form.append("category", product.category);
    form.append("isFeatured", String(product.isFeatured));
    form.append("isPublished", String(product.isPublished));
    form.append("weight", product.weight);
    form.append("stock", String(product.stock));
    form.append("user", USER_ID);

    form.append("dimensions", JSON.stringify(product.dimensions));
    form.append("metaTitle", product.metaTitle);
    form.append("metaDescription", product.metaDescription);
    form.append("metaKeywords", product.metaKeywords);

    // Arrays
    product.color.forEach((v) => form.append("color[]", v));
    product.size.forEach((v) => form.append("size[]", v));
    product.material.forEach((v) => form.append("material[]", v));
    product.brand.forEach((v) => form.append("brand[]", v));
    product.tags.forEach((v) => form.append("tags[]", v));

    // Images
    for (let i = 0; i < product.images.length; i++) {
      const imgPath = await downloadImage(
        product.images[i],
        `${Date.now()}-${i}.jpg`,
      );
      form.append("images", fs.createReadStream(imgPath));
    }

    // Fetch request
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Cookie: ADMIN_COOKIE,
        ...form.getHeaders(), // important for multipart/form-data
      },
      body: form, // do NOT stringify
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Seeded: ${product.name}`);
    } else {
      console.error(`❌ Failed to seed: ${product.name}`, data);
    }
  }

  console.log("🎉 All products seeded successfully");
}

seedProducts().catch(console.error);
