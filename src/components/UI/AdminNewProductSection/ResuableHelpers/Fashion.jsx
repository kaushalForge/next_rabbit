"use client";

import { useEffect, useState } from "react";
import { Input } from "../../input";
import { Button } from "../../button";
import { CardHeader, CardTitle } from "../../card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";

const EMPTY_VARIANT = {
  color: [],
  size: [],
  price: "",
  offerPrice: "",
  stock: "",
  sku: "",
  gender: "",
};

/* ---------------- HELPERS ---------------- */

const formatCSVLive = (value) => {
  if (!value) return "";

  let v = value.toUpperCase();
  v = v.replace(/\s*,\s*/g, ", ");
  v = v.replace(/,+/g, ",");
  if (v.endsWith(",")) v += " ";

  return v;
};

const csvToArray = (value, isNumber = false) => {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => (isNumber ? Number(v) : v));
};

/* ----------- CHIP PREVIEW ----------- */

const Chips = ({ value }) => {
  if (!value) return null;

  const items = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, i) => (
        <span key={i} className="px-2 py-1 text-xs rounded-md bg-muted border">
          {item}
        </span>
      ))}
    </div>
  );
};

/* -------------------- FASHION COMPONENT -------------------- */

const Fashion = ({ fashion = [], setFashion }) => {
  const [drafts, setDrafts] = useState([]);

  /* ---------- INIT ---------- */
  useEffect(() => {
    if (fashion.length === 0) {
      setFashion([{ ...EMPTY_VARIANT }]);
      setDrafts([{ color: "", size: "", price: "", offerPrice: "" }]);
    } else {
      setDrafts(
        fashion.map((v) => ({
          color: Array.isArray(v.color) ? v.color.join(", ") : v.color || "",
          size: Array.isArray(v.size) ? v.size.join(", ") : v.size || "",
          price: v.price || "",
          offerPrice: v.offerPrice || "",
        })),
      );
    }
  }, []);

  /* ---------- ADD VARIANT ---------- */
  const addVariant = () => {
    setFashion((prev) => [...prev, { ...EMPTY_VARIANT }]);
    setDrafts((prev) => [
      ...prev,
      { color: "", size: "", price: "", offerPrice: "" },
    ]);
  };

  /* ---------- ARRAY INPUT HANDLER ---------- */
  const handleArrayInput = (index, key, value, isNumber = false) => {
    // For price & offerPrice, do not apply CSV formatting
    const formatted =
      key === "price" || key === "offerPrice" ? value : formatCSVLive(value);

    // Update draft (UI)
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [key]: formatted } : d)),
    );

    // Update real state
    let valueForState;

    if (key === "price" || key === "offerPrice") {
      valueForState = formatted; // single string, no CSV logic
    } else {
      valueForState = csvToArray(formatted, isNumber); // array for others
    }

    setFashion((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: valueForState } : v)),
    );
  };

  /* ---------- NORMAL FIELD ---------- */
  const updateField = (index, key, value) => {
    setFashion((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );
  };

  /* ---------- DELETE VARIANT ---------- */
  const deleteVariant = (index) => {
    setFashion((prev) => prev.filter((_, i) => i !== index));
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardHeader className="p-0">
          <CardTitle>Fashion Variants</CardTitle>
        </CardHeader>

        <Button type="button" variant="outline" onClick={addVariant}>
          + Add Variant
        </Button>
      </div>

      {fashion.map((variant, index) => (
        <div
          key={index}
          className="grid xl:grid-cols-8 lg:grid-cols-5 md:grid-cols-2 gap-4 p-6 border rounded-xl bg-background shadow-sm"
        >
          {/* COLOR */}
          <div>
            <Input
              label="Color"
              placeholder="RED, BLACK"
              value={drafts[index]?.color || ""}
              onChange={(e) => handleArrayInput(index, "color", e.target.value)}
            />
            <Chips value={drafts[index]?.color} />
          </div>

          {/* SIZE */}
          <div>
            <Input
              label="Size"
              placeholder="S, M, L"
              value={drafts[index]?.size || ""}
              onChange={(e) => handleArrayInput(index, "size", e.target.value)}
            />
            <Chips value={drafts[index]?.size} />
          </div>

          {/* PRICE */}
          <div>
            <Input
              label="Price"
              placeholder="1299"
              value={drafts[index]?.price || ""}
              onChange={(e) =>
                handleArrayInput(index, "price", e.target.value, true)
              }
            />
          </div>

          {/* OFFER PRICE */}
          <div>
            <Input
              label="Offer Price"
              placeholder="999"
              value={drafts[index]?.offerPrice || ""}
              onChange={(e) =>
                handleArrayInput(index, "offerPrice", e.target.value, true)
              }
            />
          </div>

          {/* STOCK */}
          <Input
            label="Stock"
            type="number"
            value={variant.stock}
            onChange={(e) => updateField(index, "stock", e.target.value)}
          />

          {/* SKU */}
          <Input
            label="SKU"
            value={variant.sku}
            onChange={(e) => updateField(index, "sku", e.target.value)}
          />

          {/* GENDER */}
          <Select
            value={variant.gender}
            onValueChange={(val) => updateField(index, "gender", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteVariant(index)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Fashion;
