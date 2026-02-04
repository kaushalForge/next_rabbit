import React from "react";

const ProductDetailsDescription = ({ productDetail }) => {
  if (!productDetail) return null;

  const {
    description,
    countryOfOrigin,
    weight,
    bulletDescription = [],
    bulletKeyValueDescription = [],
    mainCategory,
    fashion = {},
  } = productDetail;

  const material = fashion?.material || [];

  return (
    <section className="mt-14 border-t pt-8 space-y-8">
      {/* ===== Description ===== */}

      {/* ===== Material (Fashion) ===== */}
      {material.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Material</h2>
          <div className="flex gap-2 flex-wrap">
            {material.map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1 border rounded bg-gray-100 text-sm"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===== Country & Weight ===== */}
      {(countryOfOrigin || weight) && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Product Info</h2>
          <div className="space-y-2 text-gray-700">
            {countryOfOrigin && (
              <p>
                <span className="font-medium">Country of Origin:</span>{" "}
                {countryOfOrigin}
              </p>
            )}
            {weight && (
              <p>
                <span className="font-medium">Weight:</span> {weight}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== Bullet Highlights ===== */}
      {bulletDescription.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Highlights</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {bulletDescription.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== Specs (Key-Value) ===== */}
      {bulletKeyValueDescription.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Specifications</h2>
          <div className="border rounded">
            {bulletKeyValueDescription.map((item, i) => (
              <div
                key={i}
                className="flex justify-between px-4 py-2 border-b text-gray-700"
              >
                <span className="font-medium">{item.key}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailsDescription;
