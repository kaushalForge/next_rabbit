"use client";

import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const EditDescriptions = ({
  description,
  setDescription,
  bulletDescription,
  setBulletDescription,
  bulletKeyValueDescription,
  setBulletKeyValueDescription,
}) => {
  const handleBulletChange = (index, value) => {
    const updated = [...bulletDescription];
    updated[index] = value;
    setBulletDescription(updated);
  };

  const addBullet = () => setBulletDescription([...bulletDescription, ""]);

  const removeBullet = (index) => {
    const updated = [...bulletDescription];
    updated.splice(index, 1);
    setBulletDescription(updated);
  };

  const handleKeyValueChange = (index, key, value) => {
    const updated = [...bulletKeyValueDescription];
    updated[index][key] = value;
    setBulletKeyValueDescription(updated);
  };

  const addKeyValue = () =>
    setBulletKeyValueDescription([
      ...bulletKeyValueDescription,
      { key: "", value: "" },
    ]);

  const removeKeyValue = (index) => {
    const updated = [...bulletKeyValueDescription];
    updated.splice(index, 1);
    setBulletKeyValueDescription(updated);
  };

  return (
    <section className="space-y-6">
      {/* MAIN DESCRIPTION */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-xl p-3 h-32"
        />
      </div>

      {/* BULLET DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Bullet Points</label>
        {bulletDescription.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={b}
              onChange={(e) => handleBulletChange(i, e.target.value)}
              className="w-full border rounded-xl p-2"
              placeholder={`Bullet point ${i + 1}`}
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
          className="flex items-center gap-2 text-indigo-600 font-medium"
        >
          <FaPlus /> Add Bullet
        </button>
      </div>

      {/* BULLET KEY-VALUE DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Bullet Key-Value Pairs</label>
        {bulletKeyValueDescription.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={b.key}
              onChange={(e) => handleKeyValueChange(i, "key", e.target.value)}
              className="w-1/2 border rounded-xl p-2"
              placeholder="Key"
            />
            <input
              type="text"
              value={b.value}
              onChange={(e) => handleKeyValueChange(i, "value", e.target.value)}
              className="w-1/2 border rounded-xl p-2"
              placeholder="Value"
            />
            <button
              type="button"
              onClick={() => removeKeyValue(i)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addKeyValue}
          className="flex items-center gap-2 text-indigo-600 font-medium"
        >
          <FaPlus /> Add Key-Value
        </button>
      </div>
    </section>
  );
};

export default EditDescriptions;
