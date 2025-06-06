import React, { useState, useRef, useEffect, useCallback } from "react";

const defaultCountry = {
  code: "+91",
  name: "India",
  flag: "🇮🇳",
  code2: "IN",
  id: "IN",
};

const CountryCode = ({ onCountryCodeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const hasInitialized = useRef(false);

  // Memoize the country selection callback
  const handleCountrySelect = useCallback(
    (country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchTerm("");
      onCountryCodeChange(country.code);
    },
    [onCountryCodeChange]
  );

  // Fetch countries only once when component mounts
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2"
        );
        const data = await response.json();

        // Filter and format countries that have calling codes
        const formattedCountries = data
          .filter((country) => country.idd.root && country.idd.suffixes)
          .map((country) => ({
            code: country.idd.root + (country.idd.suffixes[0] || ""),
            name: country.name.common,
            flag: country.flags.svg,
            code2: country.idd.root.replace("+", ""),
            id: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Add default country (India) at the start
        const allCountries = [
          defaultCountry,
          ...formattedCountries.filter((c) => c.code !== defaultCountry.code),
        ];
        setCountries(allCountries);
        setSelectedCountry(defaultCountry);
        onCountryCodeChange(defaultCountry.code);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback to basic list if API fails
        const fallbackCountries = [
          defaultCountry,
          { code: "+1", name: "USA", flag: "🇺🇸", code2: "US", id: "US" },
          { code: "+44", name: "UK", flag: "🇬🇧", code2: "GB", id: "GB" },
        ];
        setCountries(fallbackCountries);
        setSelectedCountry(defaultCountry);
        onCountryCodeChange(defaultCountry.code);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []); // Empty dependency array since we only want to fetch once

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((country) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const nameMatch = country.name.toLowerCase().includes(searchLower);
    const codeMatch = country.code
      .replace("+", "")
      .includes(searchLower.replace("+", ""));
    return nameMatch || codeMatch;
  });

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 px-3 py-2.5 bg-[#1c1c1c] border border-[#303030] rounded-l-lg text-sm text-gray-400"
      >
        Loading...
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 bg-[#1c1c1c] border border-[#303030] rounded-l-lg text-sm text-white hover:bg-[#252525] transition-colors"
      >
        {selectedCountry?.flag ? (
          <img
            src={selectedCountry.flag}
            alt={selectedCountry.name}
            className="w-5 h-3 object-cover rounded-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-lg">🌐</span>
        )}
        <span>{selectedCountry.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#252525] max-h-60 overflow-hidden">
          <div className="p-2 border-b border-[#252525]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country or code..."
              className="w-full px-3 py-2 text-sm bg-[#1c1c1c] border border-[#303030] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f1c40f] focus:ring-1 focus:ring-[#f1c40f]"
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#252525] flex items-center gap-2 ${
                  selectedCountry?.id === country.id
                    ? "bg-[#252525] text-[#f1c40f]"
                    : "text-white"
                }`}
              >
                {country.flag ? (
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-5 h-3 object-cover rounded-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-lg">🌐</span>
                )}
                <span>{country.name}</span>
                <span className="text-gray-400 ml-auto">{country.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCode;
