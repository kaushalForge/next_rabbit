"use client";
import { useEffect } from "react";
import { Input } from "../../input";
import { Button } from "../../button";
import { CardHeader, CardTitle } from "../../card";

// EMPTY_BATCH: Always number for price/offerPrice
const EMPTY_BATCH = {
  sku: "",
  foodType: "",
  weight: "",
  taste: "",
  batchNumber: "",
  stock: 0,
  price: 0,
  offerPrice: 0,
};

// Deep copy helper
const cloneBatch = (batch) => JSON.parse(JSON.stringify(batch));

const Food = ({ food, setFood }) => {
  /* ================= INITIAL EMPTY BATCH ================= */
  useEffect(() => {
    if (!food || !food.length) {
      setFood([cloneBatch(EMPTY_BATCH)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= ADD NEW BATCH ================= */
  const addBatch = () => setFood((prev) => [...prev, cloneBatch(EMPTY_BATCH)]);

  /* ================= UPDATE BATCH FIELD ================= */
  const updateBatch = (index, field, value) => {
    setFood((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        // Always create a new object to avoid reference sharing
        const updated = { ...b };
        if (field === "price" || field === "offerPrice" || field === "stock") {
          updated[field] = Number(value) || 0;
        } else {
          updated[field] = value;
        }
        return updated;
      }),
    );
  };

  /* ================= DELETE BATCH ================= */
  const removeBatch = (index) => {
    const batch = food[index];
    const hasValue = Object.values(batch).some(
      (v) => v !== "" && v !== 0 && v !== null && v !== undefined,
    );

    if (!hasValue) {
      setFood((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (window.confirm("This batch contains data. Delete anyway?")) {
      setFood((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* ================= LOG FOR DEBUG ================= */
  const logFood = () => console.log("FOOD BATCHES 👉", food);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <CardHeader className="p-0">
          <CardTitle>Food Batches</CardTitle>
        </CardHeader>

        <Button type="button" variant="outline" onClick={addBatch}>
          + Add Batch
        </Button>
      </div>

      {/* BATCH FIELDS */}
      {food.map((b, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-2 border rounded-xl p-3 items-center"
        >
          <Input
            label="SKU"
            placeholder="CLB-001"
            value={b.sku}
            onChange={(e) => updateBatch(i, "sku", e.target.value)}
          />

          <Input
            label="Food Type"
            placeholder="Veg, Non-Veg"
            value={b.foodType}
            onChange={(e) => updateBatch(i, "foodType", e.target.value)}
          />

          <Input
            label="Weight"
            placeholder="1kg"
            value={b.weight}
            onChange={(e) => updateBatch(i, "weight", e.target.value)}
          />

          <Input
            label="Taste"
            placeholder="Sweet"
            value={b.taste}
            onChange={(e) => updateBatch(i, "taste", e.target.value)}
          />

          <Input
            label="Batch Number"
            placeholder="1234"
            value={b.batchNumber}
            onChange={(e) => updateBatch(i, "batchNumber", e.target.value)}
          />

          <Input
            label="Stock"
            type="number"
            placeholder="Stock"
            value={b.stock}
            onChange={(e) => updateBatch(i, "stock", e.target.value)}
          />

          <Input
            label="Price"
            type="number"
            placeholder="1299"
            value={b.price}
            onChange={(e) => updateBatch(i, "price", e.target.value)}
          />

          <Input
            label="Offer Price"
            type="number"
            placeholder="999"
            value={b.offerPrice}
            onChange={(e) => updateBatch(i, "offerPrice", e.target.value)}
          />

          <Button
            type="button"
            variant="destructive"
            onClick={() => removeBatch(i)}
          >
            Delete
          </Button>
        </div>
      ))}

      {food.length > 0 && (
        <button
          type="button"
          onClick={logFood}
          className="text-sm underline text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          Log batches to console
        </button>
      )}
    </div>
  );
};

export default Food;
