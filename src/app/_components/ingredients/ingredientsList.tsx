import type { Ingredient } from "~/app/types/ingredient";
interface IngredientsListProps {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
}

export default function IngredientsList(props: IngredientsListProps) {
  const { ingredients, setIngredients } = props;

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.name}>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1">{ingredient.name}</div>
              <div className="flex-1">
                <button
                  className="rounded-md bg-white/10 px-2 py-1 text-sm text-white/70 hover:bg-white/20"
                  onClick={() =>
                    setIngredients(
                      ingredients.filter((i) => i.name !== ingredient.name),
                    )
                  }
                >
                  x
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
