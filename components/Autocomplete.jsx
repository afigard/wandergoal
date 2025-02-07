import { useState, useEffect } from "react";

export default function Autocomplete({ options, value, onChange }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    if (!Array.isArray(value)) {
      setQuery(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 0) {
      const filtered = options.filter((option) =>
        option.toLowerCase().startsWith(newQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionClick = (option) => {
    if (Array.isArray(value)) {
      if (!value.includes(option)) {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
    }
    setQuery("");
    setFilteredOptions([]);
  };

  const handleTagRemove = (removedCountry) => {
    const updatedValue = value.filter((country) => country !== removedCountry);
    onChange(updatedValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg text-lg"
        placeholder="Type a country..."
      />
      <div className="flex flex-wrap mt-2">
        {Array.isArray(value) &&
          value.map((selectedCountry, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 text-gray-800 py-1 px-2 mr-2 rounded-lg"
            >
              {selectedCountry}
              <button
                type="button"
                onClick={() => handleTagRemove(selectedCountry)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
      </div>
      {filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mb-2 w-full max-h-40 overflow-y-auto bottom-full top-auto">
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
