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

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(inputText);
      setInputText("");
    }
  };

  return (
    <input
      type="text"
      className="text-black"
      placeholder="greek yogurt"
      onChange={handleInputChange}
      onKeyDown={handleInputSubmit}
      value={inputText}
    />
  );
}
