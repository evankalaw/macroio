import OpenAI, { OpenAIError } from "openai";
import { env } from "~/env";
import { type Ingredient } from "../db";

export interface RecipeNutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface GeneratedRecipe {
  name: string;
  ingredients: string[];
  instructions: string;
  nutritionalInfo: RecipeNutritionalInfo;
}

interface OpenAIRecipeResponse {
  recipes: GeneratedRecipe[];
}

export class OpenAiService {
  private openAiClient: OpenAI;

  constructor() {
    this.openAiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    if (!this.openAiClient || !this.openAiClient.apiKey) {
      console.warn("Open AI Api Key not set configured properly.");
    }
  }

  async getRecipes(
    ingredients: Ingredient[],
  ): Promise<OpenAIRecipeResponse | undefined> {
    console.log(ingredients);

    try {
      const result = await this.openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              'You are a nutritionally minded chef, creating meals for a client. Based on their available ingredients and any nutritional requirements, generate up to 3 recipe suggestions. Return ONLY a raw JSON object without any markdown formatting or code blocks, using this structure: {"recipes":[{"name":"Recipe Name","ingredients":["ingredient1","ingredient2"],"instructions":"Step-by-step cooking instructions","nutritionalInfo":{"calories":0,"protein":0,"fat":0,"carbs":0}}]}. Feel free to add ingredients that are common that the user does not list, such as seasonings, or common household goods.',
          },
          {
            role: "user",
            content: `Please create recipes using these ingredients with their nutritional information: ${ingredients
              .map(
                (ing) =>
                  `${ing.name} (per ${ing.servingSize}${ing.servingUnit}: ` +
                  `${ing.calories} calories, ` +
                  `${ing.protein}g protein, ` +
                  `${ing.fat}g fat, ` +
                  `${ing.carbs}g carbs)`,
              )
              .join(", ")}`,
          },
        ],
      });

      const content = result.choices[0]?.message.content;
      if (!content) return undefined;

      try {
        const parsedResponse = JSON.parse(content) as OpenAIRecipeResponse;
        return parsedResponse;
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", parseError);
        return undefined;
      }
    } catch (e) {
      if (e instanceof OpenAIError) {
        console.error("Open AI data", e.cause, e.message, e.name);
      } else {
        console.error(
          "There was a problem generating a response from OpenAI",
          e,
        );
      }
      return undefined;
    }
  }
}

export const openAiService = new OpenAiService();
