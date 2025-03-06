import { type GeneratedRecipe } from "~/server/services/openai";

interface RecipeListProps {
  recipes: GeneratedRecipe[];
}

export default function RecipeList(props: RecipeListProps) {
  const { recipes } = props;

  return (
    <div className="w-full max-w-md space-y-4">
      <h3 className="mb-2 text-xl font-semibold">Generated Recipes</h3>
      <ul className="space-y-4">
        {recipes.map((recipe) => {
          const instructionRegex = /\d+\.s*/;
          const recipeSteps = recipe.instructions
            .split(instructionRegex)
            .filter(Boolean);

          return (
            <li
              key={recipe.name}
              className="overflow-hidden rounded-lg bg-black/30 shadow-lg"
            >
              <div className="border-b border-white/10 bg-black/20 p-4">
                <h4 className="text-lg font-medium">{recipe.name}</h4>
                <p className="mt-1 text-sm text-white/70">
                  {recipe.nutritionalInfo.calories} calories per serving
                </p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h5 className="mb-2 text-sm font-medium uppercase tracking-wide text-white/70">
                    Ingredients
                  </h5>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-white/90">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="mb-2 text-sm font-medium uppercase tracking-wide text-white/70">
                    Instructions
                  </h5>
                  {recipeSteps.map((step, index) => {
                    return (
                      <p
                        className="whitespace-pre-wrap text-sm text-white/90"
                        key={`${recipe.name}-step-${index + 1}`}
                      >
                        {index + 1}. {step.trim()}{" "}
                      </p>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
