"use client";

import { FaPlus, FaTrash } from "react-icons/fa";

/* ---------- SAFE HELPERS ---------- */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeString = (v) => (typeof v === "string" ? v : "");

const Descriptions = ({
  description,
  setDescription,

  bulletDescription,
  setBulletDescription,

  bulletKeyValueDescription,
  setBulletKeyValueDescription,
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
    setBulletDescription?.(bullets.filter((_, i) => i !== index));
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
    setBulletKeyValueDescription?.(keyValues.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">
      {/* ================= FULL DESCRIPTION ================= */}
      <div className="space-y-2">
        <h3 className="font-semibold">Product Description</h3>
        <textarea
          value={safeString(description)}
          onChange={(e) => setDescription?.(e.target.value)}
          placeholder="Full product description"
          className="border rounded-xl p-3 h-32 w-full"
        />
      </div>

      {/* ================= BULLET DESCRIPTION ================= */}
      <div className="space-y-3">
        <h3 className="font-semibold">Bullet Highlights</h3>

        {bullets.length === 0 && (
          <p className="text-sm text-gray-400">No bullet points added yet.</p>
        )}

        {bullets.map((bullet, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={safeString(bullet)}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder={`Bullet point ${i + 1}`}
              className="border rounded-xl p-3 w-full"
            />
            <button
              type="button"
              onClick={() => removeBullet(i)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addBullet}
          className="flex items-center gap-2 text-sm text-blue-600"
        >
          <FaPlus /> Add Bullet
        </button>
      </div>

      {/* ================= KEY VALUE DESCRIPTION ================= */}
      <div className="space-y-3">
        <h3 className="font-semibold">Specifications (Key / Value)</h3>

        {keyValues.length === 0 && (
          <p className="text-sm text-gray-400">No specifications added yet.</p>
        )}

        {keyValues.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              placeholder="Key"
              value={safeString(row?.key)}
              onChange={(e) => updateKeyValue(i, "key", e.target.value)}
              className="border rounded-xl p-3"
            />
            <input
              placeholder="Value"
              value={safeString(row?.value)}
              onChange={(e) => updateKeyValue(i, "value", e.target.value)}
              className="border rounded-xl p-3"
            />
            <button
              type="button"
              onClick={() => removeKeyValue(i)}
              className="text-red-500 col-span-2 text-right text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addKeyValue}
          className="flex items-center gap-2 text-sm text-blue-600"
        >
          <FaPlus /> Add Specification
        </button>
      </div>
    </div>
  );
};

export default Descriptions;
