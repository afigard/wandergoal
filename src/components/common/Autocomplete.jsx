import { useState, useEffect } from "react";
import countriesWithFlags from "../../lib/constants/countriesWithFlags.json";

function getFlagEmoji(countryName) {
  const code = countriesWithFlags[countryName];
  if (!code) return "";

  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function Autocomplete({ options, value, onChange, error }) {
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
        className={`block w-full p-3 border rounded-lg text-base focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Type a country..."
      />
      <div className="flex flex-wrap">
        {Array.isArray(value) &&
          value.map((selectedCountry, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 text-gray-800 py-1 px-2 mr-2 rounded-lg mt-2"
            >
              <span className="mr-1">{getFlagEmoji(selectedCountry)}</span>
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
              className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
            >
              <span className="mr-2">{getFlagEmoji(option)}</span>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
