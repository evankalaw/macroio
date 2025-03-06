import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { openAiService } from "~/server/services/openai";

const IngredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  brandName: z.string().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  fat: z.number().optional(),
  carbs: z.number().optional(),
  servingSize: z.number().optional(),
  servingUnit: z.string().optional(),
  createdAt: z.string(),
});

export const openAiRouter = createTRPCRouter({
  /**
   * Get a recipe based on a list of ingredients from OpenAI
   */
  getRecipes: publicProcedure
    .input(z.object({ ingredients: z.array(IngredientSchema) }))
    .mutation(async ({ input }) => {
      return openAiService.getRecipe(input.ingredients);
    }),
});
