"use client";

import { useState } from "react";
import type { Ingredient } from "~/app/types/ingredient";
import IngredientsList from "./ingredientsList";
import IngredientsInput from "./ingredientsInput";
import { api } from "~/trpc/react";

export default function IngredientsManager() {
  // const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState("");

  const { data: ingredients, isLoading } = api.ingredient.getAll.useQuery();

  const utils = api.useUtils();

  const createIngredient = api.ingredient.create.useMutation({
    onSuccess: async () => {
      await utils.ingredient.getAll.invalidate();
      setNewIngredientName("");
    },
  });

  const deleteIngredient = api.ingredient.delete.useMutation({
    onSuccess: async () => {
      await utils.ingredient.getAll.invalidate();
    },
  });

  const handleAddIngredient = (ingredientName: string) => {
    if (ingredientName.trim()) {
      createIngredient.mutate({ name: ingredientName });
    }
  };

  const handleDeleteIngredient = (id: string) => {
    deleteIngredient.mutate({ id });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <IngredientsInput onSubmit={handleAddIngredient} />

      {isLoading ? (
        <div className="mt-4 text-center text-sm text-white/70">
          Loading ingredients...
        </div>
      ) : ingredients && ingredients.length > 0 ? (
        <div className="w-full max-w-md">
          <h3 className="mb-2 text-xl font-semibold">Your Ingredients</h3>
          <ul className="space-y-2">
            {ingredients.map((ingredient) => (
              <li
                key={ingredient.id}
                className="flex items-center justify-between rounded-lg bg-white/10 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{ingredient.name}</p>
                  {ingredient.calories && (
                    <p className="text-sm text-white/70">
                      {ingredient.calories} calories
                    </p>
                  )}
                </div>
                <button
                  className="ml-2 rounded-md bg-white/10 px-2 py-1 text-sm text-white/70 hover:bg-white/20"
                  onClick={() => handleDeleteIngredient(ingredient.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 text-center text-sm lowercase italic text-white/70">
          Enter some ingredients to get started
        </div>
      )}
    </div>
  );
}
