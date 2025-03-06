import { join } from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

// Define types for your database
export type Ingredient = {
  id: string;
  name: string;
  brandName?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  servingSize?: number;
  servingUnit?: string;
  createdAt: string;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: string[]; // Array of ingredient IDs
  instructions: string;
  upvotes: number;
  createdAt: string;
  isUserFavorite: boolean;
};

// Define the structure of your database
export type DBData = {
  ingredients: Ingredient[];
  recipes: Recipe[];
};

// Create a singleton instance of the database
let db: Low<DBData> | null = null;

export const getDb = async (): Promise<Low<DBData>> => {
  if (db) return db;

  // Define where the JSON file will be stored
  const dbPath = join(process.cwd(), "db.json");

  // Create the adapter and db instance
  const adapter = new JSONFile<DBData>(dbPath);
  db = new Low<DBData>(adapter, { ingredients: [], recipes: [] });

  // Read the database
  await db.read();

  // Initialize with default data if empty
  db.data = db.data || { ingredients: [], recipes: [] };

  return db;
};

// Helper function to generate IDs
export const generateId = (): string => {
  return uuidv4();
};
