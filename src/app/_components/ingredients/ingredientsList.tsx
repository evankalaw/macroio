import type { Ingredient } from "~/app/types/ingredient";
interface IngredientsListProps {
  ingredients: Ingredient[];
}

export default function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <ul>
      {ingredients.map((ingredient) => (
        <li key={ingredient.name}>{ingredient.name}</li>
      ))}
    </ul>
  );
}
