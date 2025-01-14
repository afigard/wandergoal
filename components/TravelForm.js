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
  "Bolivia (Plurinational State of)",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei Darussalam",
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
  "Congo",
  "Costa Rica",
  "Côte D'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic People's Republic of Korea",
  "Democratic Republic of the Congo",
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
  "Gambia (Republic of The)",
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
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
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
  "Lao People's Democratic Republic",
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
  "Micronesia (Federated States of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (Kingdom of the)",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Republic of Korea",
  "Republic of Moldova",
  "Romania",
  "Russian Federation",
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
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "State of Palestine",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Tajikistan",
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
  "United Kingdom of Great Britain and Northern Ireland",
  "United Republic of Tanzania",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela, Bolivarian Republic of",
  "Viet Nam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function TravelForm() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    targetCountries: "",
    targetAge: "",
    currentAge: "",
    residence: "",
    visited: [],
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (storedUserId) {
      const fetchLastPlan = async () => {
        try {
          const response = await fetch(
            `/api/user-last-plan?userId=${storedUserId}`
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResidenceChange = (value) => {
    setFormData({ ...formData, residence: value });
  };

  const handleVisitedChange = (value) => {
    setFormData({ ...formData, visited: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push("/plan");
      } else {
        console.error("Error saving travel plan:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
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
          className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your current age"
        />
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
          className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your target countries"
        />
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
          className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your target age"
        />
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
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition"
      >
        Plan My Travel
      </button>
    </form>
  );
}
