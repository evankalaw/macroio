import OpenAI, { OpenAIError } from "openai";
import { env } from "~/env";
import { Ingredient } from "../db";

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

  async getRecipe(ingredients: Ingredient[]) {
    console.log(ingredients);

    try {
      const result = await this.openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              'You are a nutritionally minded chef, creating meals for a client. Based on their available ingredients and any nutritional requirements, generate up to 3 recipe suggestions. Always respond with a valid JSON object with the following structure: {"recipes":[{"name":"Recipe Name","ingredients":["ingredient1","ingredient2"],"instructions":"Step-by-step cooking instructions","nutritionalInfo":{"calories":0,"protein":0,"fat":0,"carbs":0}}]}',
          },
          { role: "user", content: `Please create recipes using these ingredients: ${ingredients.join(', ')} },
        ],
      });

      return result.choices[0]?.message.content;
    } catch (e) {
      if (e instanceof OpenAIError) {
        console.error("Open AI data", e.cause, e.message, e.name);
      } else {
        console.error(
          "There was a problem generating a response from OpenAI",
          e,
        );
      }
    }
  }
}

export const openAiService = new OpenAiService();
