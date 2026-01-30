"use client";

import Fashion from "./HelpersUI/Fashion";
import Food from "./HelpersUI/Food";
import Descriptions from "./HelpersUI/Descriptions";

/* =====================================================
 * SAFE HELPERS
 * ===================================================== */
const safeString = (value) => (typeof value === "string" ? value : "");

const SectionOne = (props) => {
  /* =====================================================
   * SAFE DESTRUCTURING
   * ===================================================== */
  const {
    name,
    setName,
    brand,
    setBrand,
    mainCategory,
    setMainCategory,
    color,
    setColor,
    size,
    setSize,
    material,
    setMaterial,
    gender,
    setGender,
    category,
    setCategory,
    weight,
    setWeight,
    metaTitle,
    setMetaTitle,

    description,
    setDescription,
    bulletDescription,
    setBulletDescription,
    bulletKeyValueDescription,
    setBulletKeyValueDescription,
    countryOfOrigin,
    setCountryOfOrigin,

    dimensions,
    setDimensions,

    metaDescription,
    setMetaDescription,

    offerPrice,
    setOfferPrice,
    price,
    setPrice,
    stock,
    setStock,

    sku,
    setSku,
    foodType,
    setFoodType,
    taste,
    setTaste,

    isFeatured,
    setIsFeatured,
    isPublished,
    setIsPublished,
  } = props;

  /* =====================================================
   * JSX
   * ===================================================== */
  return (
    <section className="lg:col-span-2 space-y-10">
      {/* ================= BASIC INFO ================= */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Product Name"
          value={safeString(name)}
          onChange={(e) => setName?.(e.target.value)}
          className="border rounded-xl p-3"
        />
        <input
          placeholder="Brand"
          value={safeString(brand)}
          onChange={(e) => setBrand?.(e.target.value)}
          className="border rounded-xl p-3"
        />

        <select
          value={safeString(mainCategory)}
          onChange={(e) => setMainCategory?.(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">Select Main Category</option>
          <option value="Fashion">Fashion</option>
          <option value="Food">Food</option>
        </select>

        <input
          placeholder="Category"
          value={safeString(category)}
          onChange={(e) => setCategory?.(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Weight"
          value={safeString(weight)}
          onChange={(e) => setWeight?.(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Country of Origin"
          value={safeString(countryOfOrigin)}
          onChange={(e) => setCountryOfOrigin?.(e.target.value)}
          className="border rounded-xl p-3"
        />
      </div>

      {/* ================= DESCRIPTIONS ================= */}
      <Descriptions
        description={description}
        setDescription={setDescription}
        bulletDescription={bulletDescription}
        setBulletDescription={setBulletDescription}
        bulletKeyValueDescription={bulletKeyValueDescription}
        setBulletKeyValueDescription={setBulletKeyValueDescription}
      />

      {/* ================= CATEGORY SPECIFIC ================= */}
      {mainCategory === "Fashion" && (
        <Fashion
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          material={material}
          setMaterial={setMaterial}
          gender={gender}
          setGender={setGender}
          dimensions={dimensions}
          setDimensions={setDimensions}
        />
      )}
      {mainCategory === "Food" && (
        <Food
          sku={sku}
          setSku={setSku}
          foodType={foodType}
          setFoodType={setFoodType}
          taste={taste}
          setTaste={setTaste}
        />
      )}

      {/* ================= PRICING ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Original Price"
          value={offerPrice ?? ""}
          onChange={(e) => setOfferPrice?.(e.target.value)}
          className="border rounded-xl p-3"
        />
        <input
          type="number"
          placeholder="Price"
          value={price ?? ""}
          onChange={(e) => setPrice?.(e.target.value)}
          className="border rounded-xl p-3"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock ?? ""}
          onChange={(e) => setStock?.(e.target.value)}
          className="border rounded-xl p-3"
        />
      </div>

      {/* ================= SEO ================= */}
      <input
        placeholder="Meta Title"
        value={safeString(metaTitle)}
        onChange={(e) => setMetaTitle?.(e.target.value)}
        className="border rounded-xl p-3 w-full"
      />
      <textarea
        placeholder="Meta Description"
        value={safeString(metaDescription)}
        onChange={(e) => setMetaDescription?.(e.target.value)}
        className="border rounded-xl p-3 h-24 w-full"
      />

      {/* ================= FLAGS ================= */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!isFeatured}
            onChange={(e) => setIsFeatured?.(e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!isPublished}
            onChange={(e) => setIsPublished?.(e.target.checked)}
          />
          Published
        </label>
      </div>
    </section>
  );
};

export default SectionOne;
