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
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "you're a a chef with a sense of humor, say something to brighten your customer's day",
          },
          { role: "user", content: "yo chef what up dog" },
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
