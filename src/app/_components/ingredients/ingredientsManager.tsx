"use client";

import { api } from "~/trpc/react";
import IngredientsInputWithApiAccess from "./ingredientsInputWithApiAccess";
import { type NutritionData } from "~/server/services/fatsecret";
import IngredientsList from "./ingredientsList";
import { type Ingredient } from "~/server/db";

export default function IngredientsManager() {
  const { data: ingredients, isLoading } = api.ingredient.getAll.useQuery();

  const utils = api.useUtils();

  const createIngredient = api.ingredient.create.useMutation({
    onSuccess: async () => {
      await utils.ingredient.getAll.invalidate();
    },
  });

  const deleteIngredient = api.ingredient.delete.useMutation({
    onSuccess: async () => {
      await utils.ingredient.getAll.invalidate();
    },
  });

  const generateRecipes = api.openAi.getRecipes.useMutation();

  const handleGenerateRecipe = async (ingredients: Ingredient[]) => {
    if (ingredients && ingredients.length > 0) {
      try {
        const result = await generateRecipes.mutateAsync({
          ingredients: ingredients,
        });
        console.log("Generated recipe:", result);
      } catch (error) {
        console.error("Error talking to OpenAI", error);
      }
    }
  };

  const handleAddIngredient = async (ingredient: NutritionData) => {
    if (ingredient.foodName.trim()) {
      try {
        // Create a new query instance with the correct food ID
        const details = await utils.nutrition.getFoodDetails.fetch({
          foodId: ingredient.foodId,
        });

        if (details) {
          createIngredient.mutate({
            name: details.foodName,
            brandName: details.brandName,
            calories: details.calories,
            protein: details.protein,
            fat: details.fat,
            carbs: details.carbs,
            servingSize: details.servingSize,
            servingUnit: details.servingUnit,
          });
        }
      } catch (error) {
        console.error("Error fetching food details:", error);
      }
    }
  };

  const handleDeleteIngredient = (id: string) => {
    deleteIngredient.mutate({ id });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <IngredientsInputWithApiAccess onSelectIngredient={handleAddIngredient} />

      {isLoading ? (
        <div className="mt-4 text-center text-sm text-white/70">
          Loading ingredients...
        </div>
      ) : ingredients && ingredients.length > 0 ? (
        <div className="w-full max-w-md">
          <h3 className="mb-2 text-xl font-semibold">Your Ingredients</h3>
          <div className="space-y-2">
            <IngredientsList
              ingredients={ingredients}
              handleDeleteIngredient={handleDeleteIngredient}
            />
            <button
              onClick={() => handleGenerateRecipe(ingredients)}
              className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Generate Recipe
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center text-sm lowercase italic text-white/70">
          Enter some ingredients to get started
        </div>
      )}
    </div>
  );
}
