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
  );
}
