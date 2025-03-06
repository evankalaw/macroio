import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { NutritionData } from "~/server/services/fatsecret";

interface IngredientsInputWithApiAccessProps {
  onSelectIngredient?: (ingredient: NutritionData) => void;
}

export default function IngredientsInputWithApiAccess({
  onSelectIngredient,
}: IngredientsInputWithApiAccessProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debouncing
  useEffect(() => {
    // Don't search if input is empty
    if (!searchInput.trim()) {
      setDebouncedInput("");
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedInput(searchInput);
      setIsSearching(false);
    }, 500); // 500ms delay

    // Clear timeout if input changes before delay completes
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Use tRPC to fetch search results
  const { data: searchResults, isLoading } = api.nutrition.searchFoods.useQuery(
    { query: debouncedInput },
    {
      enabled: debouncedInput.length > 0,
      // Cache results briefly
      staleTime: 1000 * 60,
    },
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSelectIngredient = (ingredient: NutritionData) => {
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
    // Clear search after selection
    setSearchInput("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <input
          className="w-full rounded-lg border-0 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          type="text"
          value={searchInput}
          placeholder="Search ingredients (e.g., Greek yogurt)"
          onChange={handleInputChange}
        />
        {(isSearching || isLoading) && (
          <div className="absolute right-3 top-2 animate-pulse text-gray-400">
            Searching...
          </div>
        )}
      </div>

      {searchResults && searchResults.length > 0 && (
        <div className="mt-2 rounded-lg bg-white text-black shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {searchResults.map((item) => (
              <li
                key={item.foodId}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelectIngredient(item)}
              >
                <div className="font-medium">{item.foodName}</div>
                {item.brandName && (
                  <div className="text-xs text-gray-500">{item.brandName}</div>
                )}
                <div className="mt-1 text-sm">
                  {item.calories !== undefined && `${item.calories} calories`}
                  {item.protein !== undefined && ` • ${item.protein}g protein`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
