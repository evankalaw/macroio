"use client";

import { useState } from "react";
import type { Ingredient } from "~/app/types/ingredient";
import IngredientsList from "./ingredientsList";
import IngredientsInput from "./ingredientsInput";

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "test" },
  ]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <IngredientsInput
        onSubmit={(ingredient) => {
          setIngredients([...ingredients, { name: ingredient }]);
        }}
      />
      {ingredients.length ? (
        <IngredientsList
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
      ) : (
        <div className="mt-4 text-center text-sm italic text-white/70">
          enter some ingredients to get started
        </div>
      )}
    </div>
  );
}
