require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

mongoose.connect(process.env.URI).then(async () => {
  const Product = require("../src/models/product");
  const products = await Product.find({ $or: [{ slug: null }, { slug: "" }] });

  for (const p of products) {
    p.slug = slugify(p.name);
    await p.save();
  }

  console.log(`Backfilled ${products.length} slugs`);
  process.exit();
}).catch((e) => { console.error(e); process.exit(1); });