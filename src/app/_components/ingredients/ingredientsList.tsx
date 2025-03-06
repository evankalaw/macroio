import { type Ingredient } from "~/server/db";

interface IngredientsListProps {
  ingredients: Ingredient[];
  handleDeleteIngredient: (id: string) => void;
}

export default function IngredientsList(props: IngredientsListProps) {
  const { ingredients, handleDeleteIngredient } = props;

  return (
    <ul className="space-y-2">
      {ingredients.map((ingredient) => (
        <li
          key={ingredient.id}
          className="flex items-center justify-between rounded-lg bg-black/30 p-3"
        >
          <div className="flex-1">
            <p className="font-medium">{ingredient.name}</p>
            {ingredient.brandName && (
              <p className="text-sm italic text-white/50">
                by {ingredient.brandName}
              </p>
            )}
            {ingredient.calories &&
              ingredient.servingSize &&
              ingredient.servingUnit && (
                <p className="text-sm text-white/70">
                  {ingredient.calories} calories for {ingredient.servingSize}{" "}
                  {ingredient.servingUnit}
                </p>
              )}
            {ingredient.carbs !== undefined &&
              ingredient.protein !== undefined &&
              ingredient.fat !== undefined && (
                <p className="text-sm text-white/70">
                  {ingredient.carbs}g carbs, {ingredient.protein}g protein,{" "}
                  {ingredient.fat}g fat
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
  );
}
