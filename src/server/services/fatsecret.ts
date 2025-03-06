/* eslint-disable @typescript-eslint/prefer-optional-chain */
/**
 * FatSecret API integration service
 * Handles authentication and API requests to the FatSecret Platform API
 */

// Define types for API responses
export interface FoodSearchItem {
  food_id: string;
  food_name: string;
  food_description?: string;
  brand_name?: string;
  food_type?: string;
  food_url?: string;
}

export interface FoodSearchResponse {
  foods?: {
    food: FoodSearchItem[] | FoodSearchItem;
    max_results?: number;
    page_number?: number;
    total_results?: number;
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface NutrientInfo {
  name: string;
  value: string;
  unit: string;
}

export interface ServingInfo {
  serving_id: string;
  serving_description: string;
  serving_url?: string;
  metric_serving_amount?: string;
  metric_serving_unit?: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  trans_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  calcium?: string;
  iron?: string;
}

export interface FoodDetailsResponse {
  food?: {
    food_id: string;
    food_name: string;
    food_type?: string;
    brand_name?: string;
    food_url?: string;
    servings: {
      serving: ServingInfo[] | ServingInfo;
    };
  };
  error?: {
    code: number;
    message: string;
  };
}

// Update the NutritionData interface to better handle serving information
export interface NutritionData {
  foodId: string;
  foodName: string;
  brandName?: string;
  // Nutrition values per serving
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  // Serving information
  servingSize?: number; // Changed to number for calculations
  servingUnit?: string;
  servingDescription?: string;
  // Additional serving metadata
  defaultServingSize?: number;
  defaultServingUnit?: string;
  availableServings?: Array<{
    size: number;
    unit: string;
    description: string;
  }>;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export class FatSecretService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_FATSECRET_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_FATSECRET_CLIENT_SECRET;

    if (!this.clientId || !this.clientSecret) {
      console.warn("FatSecret API credentials not configured properly.");
    }
  }
  /**
   * Get an OAuth token for the FatSecret API
   * Handles caching and automatic refresh
   */
  async getAccessToken(): Promise<string> {
    // Return existing token if valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error("FatSecret API credentials not configured");
    }

    try {
      const response = await fetch(
        "https://oauth.fatsecret.com/connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          },
          body: "grant_type=client_credentials&scope=basic",
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`FatSecret authentication failed: ${error}`);
      }

      const data = (await response.json()) as TokenResponse;

      this.accessToken = data.access_token;

      // Set expiry (typically 24 hours, but subtract 5 minutes for safety)
      const expiresIn = data.expires_in;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);

      return this.accessToken;
    } catch (error) {
      // Improve error handling with type checking
      if (error instanceof Error) {
        console.error("Failed to get FatSecret access token:", error.message);
        throw new Error(
          `Failed to authenticate with FatSecret API: ${error.message}`,
        );
      }
      // Handle non-Error objects
      console.error("Failed to get FatSecret access token:", error);
      throw new Error("Failed to authenticate with FatSecret API");
    }
  }

  /**
   * Search for foods matching a query
   */
  async searchFoods(query: string, maxResults = 10): Promise<NutritionData[]> {
    try {
      const token = await this.getAccessToken();
      const params = new URLSearchParams({
        method: "foods.search",
        search_expression: query,
        format: "json",
        max_results: maxResults.toString(),
      });

      const response = await fetch(
        `https://platform.fatsecret.com/rest/server.api?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FatSecret API error: ${errorText}`);
      }

      const data = (await response.json()) as FoodSearchResponse;

      // Debug raw API response
      console.log("Food Search Raw Response:", JSON.stringify(data, null, 2));

      if (data.error) {
        throw new Error(`FatSecret API error: ${data.error.message}`);
      }

      if (!data.foods || !data.foods.food) {
        return [];
      }

      const foods = Array.isArray(data.foods.food)
        ? data.foods.food
        : [data.foods.food];

      // Debug first food item's description format
      if (foods[0]?.food_description) {
        console.log(
          "First Food Description Format:",
          foods[0].food_description,
        );
      }

      return foods.map((food) => this.mapSearchResultToNutritionData(food));
    } catch (error) {
      console.error("Error searching foods:", error);
      return [];
    }
  }

  /**
   * Get detailed nutrition information for a specific food
   */
  async getFoodDetails(foodId: string): Promise<NutritionData | null> {
    try {
      const token = await this.getAccessToken();
      const params = new URLSearchParams({
        method: "food.get",
        food_id: foodId,
        format: "json",
      });

      const response = await fetch(
        `https://platform.fatsecret.com/rest/server.api?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FatSecret API error: ${errorText}`);
      }

      const data = (await response.json()) as FoodDetailsResponse;

      // Debug raw API response
      console.log("Food Details Raw Response:", JSON.stringify(data, null, 2));

      if (data.error) {
        throw new Error(`FatSecret API error: ${data.error.message}`);
      }

      if (!data.food) {
        return null;
      }

      // Debug serving information
      if (data.food.servings?.serving) {
        const servings = Array.isArray(data.food.servings.serving)
          ? data.food.servings.serving
          : [data.food.servings.serving];

        console.log(
          "Available Serving Sizes:",
          servings.map((s) => ({
            description: s.serving_description,
            amount: s.metric_serving_amount,
            unit: s.metric_serving_unit,
            calories: s.calories,
          })),
        );
      }

      return this.mapFoodDetailsToNutritionData(data.food);
    } catch (error) {
      console.error("Error getting food details:", error);
      return null;
    }
  }

  /**
   * Map search result to our nutrition data format
   */
  private mapSearchResultToNutritionData(food: FoodSearchItem): NutritionData {
    // Initialize variables with undefined
    let calories: number | undefined;
    let fat: number | undefined;
    let carbs: number | undefined;
    let protein: number | undefined;

    // Extract basic nutrition info from description if available
    if (food.food_description) {
      const parts = food.food_description.split("|");

      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.startsWith("Calories:")) {
          const parsed = parseFloat(trimmed.replace("Cal:", "").trim());
          calories = !isNaN(parsed) ? parsed : undefined;
        } else if (trimmed.startsWith("Fat:")) {
          const parsed = parseFloat(
            trimmed.replace("Fat:", "").replace("g", "").trim(),
          );
          fat = !isNaN(parsed) ? parsed : undefined;
        } else if (trimmed.startsWith("Carbs:")) {
          const parsed = parseFloat(
            trimmed.replace("Carbs:", "").replace("g", "").trim(),
          );
          carbs = !isNaN(parsed) ? parsed : undefined;
        } else if (trimmed.startsWith("Protein:")) {
          const parsed = parseFloat(
            trimmed.replace("Prot:", "").replace("g", "").trim(),
          );
          protein = !isNaN(parsed) ? parsed : undefined;
        }
      });
    }

    return {
      foodId: food.food_id,
      foodName: food.food_name,
      brandName: food.brand_name,
      calories,
      fat,
      carbs,
      protein,
    };
  }

  /**
   * Map detailed food info to our nutrition data format
   */
  private mapFoodDetailsToNutritionData(
    food: FoodDetailsResponse["food"],
  ): NutritionData {
    if (!food) {
      throw new Error("Invalid food data");
    }

    const servings = food.servings.serving;
    const allServings = Array.isArray(servings) ? servings : [servings];

    // Find the default serving (usually the first one or "1 serving" if available)
    const defaultServing =
      allServings.find(
        (s) => s.serving_description.toLowerCase().includes("1 serving"),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      ) || allServings[0];

    // Map all available servings
    const availableServings = allServings.map((s) => ({
      size: parseFloat(s.metric_serving_amount ?? "0"),
      unit: s.metric_serving_unit ?? "g",
      description: s.serving_description,
    }));

    // Only log if defaultServing exists and has required properties
    if (defaultServing) {
      console.log("Serving Details:", {
        defaultServing: {
          description: defaultServing.serving_description,
          amount: defaultServing.metric_serving_amount,
          unit: defaultServing.metric_serving_unit,
        },
        allServings: availableServings,
        nutritionFor: "Using default serving size",
      });
    }

    return {
      foodId: food.food_id,
      foodName: food.food_name,
      brandName: food.brand_name,
      calories: defaultServing
        ? parseFloat(defaultServing.calories)
        : undefined,
      protein: defaultServing ? parseFloat(defaultServing.protein) : undefined,
      carbs: defaultServing
        ? parseFloat(defaultServing.carbohydrate)
        : undefined,
      fat: defaultServing ? parseFloat(defaultServing.fat) : undefined,
      fiber: defaultServing?.fiber
        ? parseFloat(defaultServing.fiber)
        : undefined,
      sugar: defaultServing?.sugar
        ? parseFloat(defaultServing.sugar)
        : undefined,
      // Serving information
      servingSize: defaultServing?.metric_serving_amount
        ? parseFloat(defaultServing.metric_serving_amount)
        : undefined,
      servingUnit: defaultServing?.metric_serving_unit,
      servingDescription: defaultServing?.serving_description,
      // Additional serving metadata
      defaultServingSize: defaultServing?.metric_serving_amount
        ? parseFloat(defaultServing.metric_serving_amount)
        : undefined,
      defaultServingUnit: defaultServing?.metric_serving_unit,
      availableServings,
    };
  }
}

// Export a singleton instance
export const fatSecretService = new FatSecretService();
