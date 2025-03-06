import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const openAiRouter = createTRPCRouter({
  /**
   * Get a recipe based on a list of ingredients from OpenAI
   */
  getRecipe: publicProcedure
    .input(z.object({ ingredients: z.array(z.string()) }))
    .query(async ({ input }) => {
      return openAiService.getRecipe(input.ingredients);
    }),
});
