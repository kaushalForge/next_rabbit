"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { CardHeader, CardTitle } from "../card";

/* ---------- SAFE HELPERS ---------- */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeString = (v) => (typeof v === "string" ? v : "");

/* ---------- MAIN COMPONENT ---------- */
const Descriptions = ({
  description,
  setDescription,
  bulletDescription,
  setBulletDescription,
  bulletKeyValueDescription,
  setBulletKeyValueDescription,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
}) => {
  const bullets = safeArray(bulletDescription);
  const keyValues = safeArray(bulletKeyValueDescription);

  /* ---------- BULLET HANDLERS ---------- */
  const addBullet = () => setBulletDescription?.([...bullets, ""]);

  const updateBullet = (index, value) => {
    const copy = [...bullets];
    copy[index] = value;
    setBulletDescription?.(copy);
  };

  const removeBullet = (index) => {
    const value = bullets[index];
    if (
      !value ||
      value.trim() === "" ||
      confirm("This bullet has content. Delete anyway?")
    ) {
      setBulletDescription?.(bullets.filter((_, i) => i !== index));
    }
  };

  /* ---------- KEY VALUE HANDLERS ---------- */
  const addKeyValue = () =>
    setBulletKeyValueDescription?.([...keyValues, { key: "", value: "" }]);

  const updateKeyValue = (index, field, value) => {
    const copy = [...keyValues];
    copy[index] = { ...copy[index], [field]: value };
    setBulletKeyValueDescription?.(copy);
  };

  const removeKeyValue = (index) => {
    const { key, value } = keyValues[index];
    if (
      (!key?.trim() && !value?.trim()) ||
      confirm("This specification has content. Delete anyway?")
    ) {
      setBulletKeyValueDescription?.(keyValues.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= FULL DESCRIPTION ================= */}
      <CardHeader className="p-0">
        <CardTitle>Description & SEO</CardTitle>
      </CardHeader>
      <Textarea
        label="Product Description"
        value={safeString(description)}
        onChange={(e) => setDescription?.(e.target.value)}
        placeholder="..."
        className="resize min-h-[140px] w-full"
      />
      {/* ================= META SEO ================= */}{" "}
      <CardHeader className="p-0">
        <CardTitle>Meta Data</CardTitle>
      </CardHeader>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Meta Title"
          value={safeString(metaTitle)}
          onChange={(e) => setMetaTitle?.(e.target.value)}
          placeholder="SEO Meta Title"
        />
        <Input
          label="Meta Description"
          value={safeString(metaDescription)}
          onChange={(e) => setMetaDescription?.(e.target.value)}
          placeholder="SEO Meta Description"
        />
      </div>

      {/* ================= BULLET DESCRIPTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <CardHeader className="p-0">
            <CardTitle>Bullet Highlight</CardTitle>
          </CardHeader>
          <button
            type="button"
            onClick={addBullet}
            className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md hover:bg-muted"
          >
            <FaPlus /> Add Bullet
          </button>
        </div>

        {bullets.map((bullet, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              label={`Bullet ${i + 1}`}
              value={safeString(bullet)}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder="Designed for a perfect regular fit"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeBullet(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      {/* ================= KEY VALUE DESCRIPTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <CardHeader className="p-0">
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <button
            type="button"
            onClick={addKeyValue}
            className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md hover:bg-muted"
          >
            <FaPlus /> Add Specification
          </button>
        </div>

        {keyValues.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
          >
            <Input
              label="Key"
              placeholder="Neck Type"
              value={safeString(row?.key)}
              onChange={(e) => updateKeyValue(i, "key", e.target.value)}
            />
            <Input
              label="Value"
              placeholder="Rounded"
              value={safeString(row?.value)}
              onChange={(e) => updateKeyValue(i, "value", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeKeyValue(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Descriptions;
