import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateId, getDb, type Ingredient } from "~/server/db";

export const ingredientRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    return db.data.ingredients;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        calories: z.number().optional(),
        protein: z.number().optional(),
        fat: z.number().optional(),
        carbs: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();

      const newIngredient: Ingredient = {
        id: generateId(),
        name: input.name,
        calories: input.calories,
        protein: input.protein,
        fat: input.fat,
        carbs: input.carbs,
        createdAt: new Date().toISOString(),
      };

      db.data.ingredients.push(newIngredient);
      await db.write();

      return newIngredient;
    }),
});
