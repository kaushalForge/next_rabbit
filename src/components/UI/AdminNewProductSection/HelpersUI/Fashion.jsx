"use client";

const Fashion = ({
  color,
  setColor,
  size,
  setSize,
  material,
  setMaterial,
  gender,
  setGender,
  dimensions,
  setDimensions,
}) => {
  const csvFormatter = (label, value) => {
    let parts = value
      .split(",")
      .map((v) => {
        v = v.trim();
        if (label === "Size" || label === "Color") return v.toUpperCase();
        return v;
      })
      .filter(Boolean);

    let formatted = parts.join(", ");
    if (value.endsWith(",")) formatted += ", ";
    return formatted;
  };

  return (
    <div className="space-y-6">
      {/* ---------- CSV FIELDS ---------- */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Size", size, setSize, "S, M, L"],
          ["Color", color, setColor, "RED, BLUE"],
          ["Material", material, setMaterial, "Cotton"],
        ].map(([label, value, setter, placeholder]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              value={value}
              placeholder={placeholder}
              onChange={(e) => setter(csvFormatter(label, e.target.value))}
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------- GENDER ---------- */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Gender
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border rounded-xl p-3"
        >
          <option value="">Select gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
          <option value="Kids">Kids</option>
          <option value="Girls">Girls</option>
          <option value="Boys">Boys</option>
        </select>
      </div>

      {/* ---------- DIMENSIONS ---------- */}
      <div className="grid md:grid-cols-3 gap-4">
        {["length", "width", "height"].map((dim) => (
          <div key={dim} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {dim.toUpperCase()}
            </label>
            <input
              type="text"
              value={dimensions[dim]}
              onChange={(e) =>
                setDimensions({ ...dimensions, [dim]: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fashion;
