import { useState } from "react";

interface IngredientsInputProps {
  onSubmit: (ingredient: string) => void;
}

export default function IngredientsInput(props: IngredientsInputProps) {
  const [inputText, setInputText] = useState<string>("");
  const { onSubmit } = props;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full max-w-md">
      <div className="flex">
        <input
          type="text"
          className="flex-1 rounded-l-lg border-0 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Add an ingredient (e.g., Greek yogurt)"
          onChange={handleInputChange}
          value={inputText}
        />
        <button
          type="submit"
          className="rounded-r-lg bg-white/20 px-4 py-2 font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Add
        </button>
      </div>
    </form>
  );
}
