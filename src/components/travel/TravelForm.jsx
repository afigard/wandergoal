import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Autocomplete from "../common/Autocomplete";
import countriesData from "../../lib/constants/countriesData";

const countries = countriesData;

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

    if (!formData.residence || formData.residence.trim() === "") {
      newErrors.residence = "Residence is required.";
    }

    if (!formData.visited || formData.visited.length === 0) {
      newErrors.visited = "Visited countries are required.";
    }

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
          error={errors.residence}
        />
        {errors.residence && (
          <p className="text-red-500 text-sm">{errors.residence}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          And I have already been to ...
        </label>
        <Autocomplete
          options={countries}
          value={formData.visited}
          onChange={handleVisitedChange}
          error={errors.visited}
        />
        {errors.visited && (
          <p className="text-red-500 text-sm">{errors.visited}</p>
        )}
      </div>
      <button
        type="submit"
        className={`w-full text-white py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition ${
          loading
            ? "bg-green-700 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 via-green-500 to-green-400"
        }`}
        disabled={loading}
      >
        {loading ? "Please Wait..." : "Craft My Itinerary"}
      </button>
    </form>
  );
}
