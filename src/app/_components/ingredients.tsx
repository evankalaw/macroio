"use client";

import { useState } from "react";

type Ingredient = {
  name: string;
};

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Chicken" },
    { name: "Rice" },
    { name: "Broccoli" },
  ]);

  return (
    <div>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.name}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
}
