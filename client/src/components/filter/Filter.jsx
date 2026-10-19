
import { useEffect, useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

const FILTER_KEYS = [
  "type",
  "city",
  "property",
  "minPrice",
  "maxPrice",
  "bedroom",
  "bathroom",
  "tenant",
  "postedBy",
  "furnishing",
  "locality",
  "verified",
  "photos",
  "videos",
  "sort",
];

const TENANT_OPTIONS = [
  { value: "family", label: "Family" },
  { value: "bachelors", label: "Bachelors" },
  { value: "students", label: "Students" },
  { value: "professionals", label: "Working Professionals" },
];

const POSTED_BY_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "builder", label: "Builder" },
  { value: "agent", label: "Agent" },
];

const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

const PROPERTY_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "land", label: "Land" },
];

const BEDROOM_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

function readQuery(params) {
  return {
    type: params.get("type") || "",
    city: params.get("city") || "",
    property: params.get("property") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    bedroom: params.get("bedroom") || "",
    bathroom: params.get("bathroom") || "",
    tenant: params.get("tenant") || "",
    postedBy: params.get("postedBy") || "",
    furnishing: params.get("furnishing") || "",
    locality: params.get("locality") || "",
    verified: params.get("verified") === "true",
    photos: params.get("photos") === "true",
    videos: params.get("videos") === "true",
    sort: params.get("sort") || "",
  };
}

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => readQuery(searchParams));

  useEffect(() => {
    setQuery(readQuery(searchParams));
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setQuery((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilter = (event) => {
    event.preventDefault();

    if (
      query.minPrice &&
      query.maxPrice &&
      Number(query.minPrice) > Number(query.maxPrice)
    ) {
      window.alert("Minimum price cannot exceed maximum price.");
      return;
    }

    for (const [name, value] of [
      ["Minimum price", query.minPrice],
      ["Maximum price", query.maxPrice],
      ["Bedrooms", query.bedroom],
      ["Bathrooms", query.bathroom],
    ]) {
      if (
        value !== "" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < 0 ||
          !Number.isInteger(Number(value)))
      ) {
        window.alert(`${name} must be a valid non-negative whole number.`);
        return;
      }
    }

    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => params.delete(key));

    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) params.set(key, "true");
      } else if (String(value).trim()) {
        params.set(key, String(value).trim());
      }
    });

    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => params.delete(key));

    setQuery({
      type: "",
      city: "",
      property: "",
      minPrice: "",
      maxPrice: "",
      bedroom: "",
      bathroom: "",
      tenant: "",
      postedBy: "",
      furnishing: "",
      locality: "",
      verified: false,
      photos: false,
      videos: false,
      sort: "",
    });

    setSearchParams(params);
  };

  const removeFilter = (key) => {
    setQuery((previous) => ({
      ...previous,
      [key]: typeof previous[key] === "boolean" ? false : "",
    }));
  };

  const appliedFilters = Object.entries(query).filter(
    ([key, value]) =>
      key !== "city" &&
      key !== "sort" &&
      (typeof value === "boolean" ? value : String(value).trim() !== "")
  );

  const renderRadioGroup = (title, name, options) => (
    <div className="filterSection" key={name}>
      <h3>{title}</h3>
      <div className="filterOptions">
        {options.map((option) => (
          <label className="filterCheckbox" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={query[name] === option.value}
              onChange={handleChange}
            />
            <span>{option.label}</span>
          </label>
        ))}
        <label className="filterCheckbox">
          <input
            type="radio"
            name={name}
            value=""
            checked={!query[name]}
            onChange={handleChange}
          />
          <span>Any</span>
        </label>
      </div>
    </div>
  );

  return (
    <form className="filter" onSubmit={handleFilter}>
      <div className="filterHeading">
        <div>
          <h1>Find your property</h1>
          <p>
            Search results for <b>{query.city || "all locations"}</b>
          </p>
        </div>
        <button type="button" className="clearButton" onClick={clearFilters}>
          Clear all
        </button>
      </div>

      {appliedFilters.length > 0 && (
        <div className="appliedFilters">
          <span className="appliedLabel">Selected filters</span>
          <div className="filterChips">
            {appliedFilters.map(([key, value]) => (
              <button
                type="button"
                className="filterChip"
                key={key}
                onClick={() => removeFilter(key)}
                title={`Remove ${key}`}
              >
                {key === "verified"
                  ? "Verified"
                  : key === "photos"
                    ? "With photos"
                    : key === "videos"
                      ? "With videos"
                      : `${key}: ${value}`}
                <span aria-hidden="true"> ×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filterSection">
        <h3>Location</h3>
        <div className="item">
          <label htmlFor="city">City or area</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city or location"
            value={query.city}
            onChange={handleChange}
          />
        </div>
        <div className="item">
          <label htmlFor="locality">Locality</label>
          <input
            type="text"
            id="locality"
            name="locality"
            placeholder="Enter locality"
            value={query.locality}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filterSection">
        <h3>Looking to</h3>
        <div className="choiceButtons">
          {[
            { label: "Buy", value: "buy" },
            { label: "Rent", value: "rent" },
          ].map((option) => (
            <button
              type="button"
              key={option.value}
              className={query.type === option.value ? "choice active" : "choice"}
              onClick={() =>
                setQuery((previous) => ({
                  ...previous,
                  type: previous.type === option.value ? "" : option.value,
                }))
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filterSection">
        <h3>Budget</h3>
        <div className="rangeInputs">
          <div className="item">
            <label htmlFor="minPrice">Minimum price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              min="0"
              step="1"
              placeholder="No minimum"
              value={query.minPrice}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Maximum price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              min="0"
              step="1"
              placeholder="No maximum"
              value={query.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="filterSection">
        <h3>Property type</h3>
        <div className="filterOptions">
          {PROPERTY_OPTIONS.map((option) => (
            <label className="filterCheckbox" key={option.value}>
              <input
                type="radio"
                name="property"
                value={option.value}
                checked={query.property === option.value}
                onChange={handleChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
          <label className="filterCheckbox">
            <input
              type="radio"
              name="property"
              value=""
              checked={!query.property}
              onChange={handleChange}
            />
            <span>Any property</span>
          </label>
        </div>
      </div>

      <div className="filterSection">
        <h3>Bedrooms / BHK</h3>
        <div className="choiceButtons">
          {BEDROOM_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={query.bedroom === option.value ? "choice active" : "choice"}
              onClick={() =>
                setQuery((previous) => ({
                  ...previous,
                  bedroom:
                    previous.bedroom === option.value ? "" : option.value,
                }))
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filterSection">
        <h3>Bathrooms</h3>
        <div className="choiceButtons">
          {["1", "2", "3", "4"].map((bathroom) => (
            <button
              type="button"
              key={bathroom}
              className={query.bathroom === bathroom ? "choice active" : "choice"}
              onClick={() =>
                setQuery((previous) => ({
                  ...previous,
                  bathroom: previous.bathroom === bathroom ? "" : bathroom,
                }))
              }
            >
              {bathroom}+
            </button>
          ))}
        </div>
      </div>

      {renderRadioGroup("Tenant preference", "tenant", TENANT_OPTIONS)}
      {renderRadioGroup("Posted by", "postedBy", POSTED_BY_OPTIONS)}
      {renderRadioGroup("Furnishing", "furnishing", FURNISHING_OPTIONS)}

      <div className="filterSection">
        <h3>Quick filters</h3>
        <div className="filterOptions">
          {[
            { name: "verified", label: "Verified properties" },
            { name: "photos", label: "Properties with photos" },
            { name: "videos", label: "Properties with videos" },
          ].map((option) => (
            <label className="filterCheckbox" key={option.name}>
              <input
                type="checkbox"
                name={option.name}
                checked={query[option.name]}
                onChange={handleChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filterSection">
        <h3>Sort results</h3>
        <div className="item">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            name="sort"
            value={query.sort}
            onChange={handleChange}
          >
            <option value="">Recommended</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
            <option value="newest">Newest listings</option>
            <option value="bedroomDesc">Most bedrooms</option>
          </select>
        </div>
      </div>

      <button className="applyFilters" type="submit">
        <img src="/search.png" alt="" />
        Apply filters
      </button>
    </form>
  );
}

export default Filter;
