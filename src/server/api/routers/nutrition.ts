import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fatSecretService } from "~/server/services/fatsecret";

export const nutritionRouter = createTRPCRouter({
  /**
   * Search for foods matching a query
   */
  searchFoods: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        maxResults: z.number().min(1).max(50).optional(),
      }),
    )
    .query(async ({ input }) => {
      return fatSecretService.searchFoods(input.query, input.maxResults);
    }),

  getFoodDetails: publicProcedure
    .input(z.object({ foodId: z.string() }))
    .query(async ({ input }) => {
      return fatSecretService.getFoodDetails(input.foodId);
    }),
});
