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
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
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
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
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
  "Palestine State",
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
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Countries
        </label>
        <input
          type="number"
          name="targetCountries"
          value={formData.targetCountries}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Age
        </label>
        <input
          type="number"
          name="targetAge"
          value={formData.targetAge}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Age
        </label>
        <input
          type="number"
          name="currentAge"
          value={formData.currentAge}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Residence
        </label>
        <Autocomplete
          options={countries}
          value={formData.residence}
          onChange={handleResidenceChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visited Countries
        </label>
        <Autocomplete
          options={countries}
          value={formData.visited}
          onChange={handleVisitedChange}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg"
      >
        Plan My Travel
      </button>
    </form>
  );
}
