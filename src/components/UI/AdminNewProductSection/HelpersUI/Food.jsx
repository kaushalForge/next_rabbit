"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------- CONSTANT OPTIONS ---------- */
const FOOD_TYPES = ["Veg", "Non-Veg", "Vegan", "Egg"];
const TASTES = ["Sweet", "Spicy", "Salty", "Sour", "Bitter", "Umami"];

const Food = ({ sku, setSku, foodType, setFoodType, taste, setTaste }) => {
  return (
    <div className="space-y-6">
      {/* ---------- SKU ---------- */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">SKU</label>
        <Input
          value={sku}
          placeholder="FOOD-SKU-001"
          onChange={(e) => setSku(e.target.value.toUpperCase())}
        />
      </div>

      {/* ---------- FOOD TYPE ---------- */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Food Type</label>
        <Select value={foodType} onValueChange={setFoodType}>
          <SelectTrigger>
            <SelectValue placeholder="Select food type" />
          </SelectTrigger>
          <SelectContent>
            {FOOD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ---------- TASTE ---------- */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Taste</label>
        <Select value={taste} onValueChange={setTaste}>
          <SelectTrigger>
            <SelectValue placeholder="Select taste" />
          </SelectTrigger>
          <SelectContent>
            {TASTES.map((taste) => (
              <SelectItem key={taste} value={taste}>
                {taste}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Food;
