import { useState } from "react";

export default function IngredientsInput() {
  const [inputText, setInputText] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(inputText);
    }
  };

  return (
    <input
      type="text"
      className="text-black"
      placeholder="greek yogurt"
      onChange={handleInputChange}
      onKeyDown={handleInputSubmit}
    />
  );
}
