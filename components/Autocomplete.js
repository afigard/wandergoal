import { useState } from "react";

export default function Autocomplete({ options, value, onChange }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const query = e.target.value;
    onChange(query);
    if (query.length > 0) {
      const filtered = options.filter((option) =>
        option.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
    } else {
      setFilteredOptions([]);
      setIsOpen(false);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg text-lg"
        placeholder="Type your country..."
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
