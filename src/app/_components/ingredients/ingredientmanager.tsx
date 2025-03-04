"use client";

import { useState } from "react";
import type { Ingredient } from "~/app/types/ingredient";
import IngredientsList from "./ingredientsList";

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Chicken" },
    { name: "Rice" },
    { name: "Broccoli" },
  ]);

  return (
    <div>
      <IngredientsList ingredients={ingredients} />
    </div>
  );
}
