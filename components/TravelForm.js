import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Autocomplete from "./Autocomplete";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Ivory Coast",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Viet Nam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function TravelForm() {
  const [guestId, setguestId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    targetCountries: "",
    targetAge: "",
    currentAge: "",
    residence: "",
    visited: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedguestId = localStorage.getItem("guestId");
    setguestId(storedguestId);

    if (storedguestId) {
      const fetchLastPlan = async () => {
        try {
          const response = await fetch(
            `/api/user-last-plan?guestId=${storedguestId}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.lastPlan) {
              setFormData({
                ...formData,
                currentAge: data.lastPlan.current_age || "",
                residence: data.lastPlan.residence || "",
                visited: data.lastPlan.visitedCountries || [],
              });
            }
          } else {
            console.error("Error fetching last plan:", await response.json());
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchLastPlan();
    }
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "currentAge") {
      if (!value || value <= 0) error = "Age must be a positive number.";
    } else if (name === "targetCountries") {
      if (!value || value <= 0)
        error = "Target countries must be a positive number.";
      else if (value > 195)
        error = "There are only 195 countries in the world!";
    } else if (name === "targetAge") {
      if (!value || value <= formData.currentAge)
        error = "Target age must be greater than your current age.";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleResidenceChange = (value) => {
    setFormData((prevFormData) => {
      const alreadyVisited = prevFormData.visited.includes(value);
      const updatedVisited = alreadyVisited
        ? prevFormData.visited
        : [...prevFormData.visited, value];

      return { ...prevFormData, residence: value, visited: updatedVisited };
    });
  };

  const handleVisitedChange = (value) => {
    setFormData({ ...formData, visited: value });
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.currentAge = validateField("currentAge", formData.currentAge);
    newErrors.targetCountries = validateField(
      "targetCountries",
      formData.targetCountries
    );
    newErrors.targetAge = validateField("targetAge", formData.targetAge);

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error("Form contains errors.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, guestId }),
      });

      if (response.ok) {
        router.push("/plans");
      } else {
        console.error("Error saving travel plan:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          I am ... years old
        </label>
        <input
          type="number"
          name="currentAge"
          value={formData.currentAge}
          onChange={handleChange}
          className={`block w-full p-3 border rounded-lg text-base focus:outline-none ${
            errors.currentAge ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your current age"
        />
        {errors.currentAge && (
          <p className="text-red-500 text-sm">{errors.currentAge}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          I want to visit ... more countries
        </label>
        <input
          type="number"
          name="targetCountries"
          value={formData.targetCountries}
          onChange={handleChange}
          className={`block w-full p-3 border rounded-lg text-base focus:outline-none ${
            errors.targetCountries ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your target countries"
        />
        {errors.targetCountries && (
          <p className="text-red-500 text-sm">{errors.targetCountries}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          By the age of ...
        </label>
        <input
          type="number"
          name="targetAge"
          value={formData.targetAge}
          onChange={handleChange}
          className={`block w-full p-3 border rounded-lg text-base focus:outline-none ${
            errors.targetAge ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your target age"
        />
        {errors.targetAge && (
          <p className="text-red-500 text-sm">{errors.targetAge}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          I live in ...
        </label>
        <Autocomplete
          options={countries}
          value={formData.residence}
          onChange={handleResidenceChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          And I have already been to ...
        </label>
        <Autocomplete
          options={countries}
          value={formData.visited}
          onChange={handleVisitedChange}
          className="mt-1"
        />
      </div>
      <button
        type="submit"
        className={`w-full text-white py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition ${
          loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Plan My Travel"}
      </button>
    </form>
  );
}
