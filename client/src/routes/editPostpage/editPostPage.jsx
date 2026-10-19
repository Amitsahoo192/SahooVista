
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import "./editPostPage.scss";

function EditPostPage() {
  const post = useLoaderData();
  const navigate = useNavigate();

  const [description, setDescription] = useState(post.postDetail?.desc || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: post.title || "",
    price: post.price ?? "",
    address: post.address || "",
    city: post.city || "",
    bedroom: post.bedroom ?? "",
    bathroom: post.bathroom ?? "",
    type: post.type || "rent",
    property: post.property || "apartment",
    latitude: post.latitude || "",
    longitude: post.longitude || "",
    furnishing: post.furnishing || "",
    postedBy: post.postedBy || "",
    tenantPreference: post.tenantPreference || [],
    videoUrl: post.videoUrl || "",
    utilities: post.postDetail?.utilities || "",
    pet: post.postDetail?.pet || "",
    income: post.postDetail?.income || "",
    size: post.postDetail?.size ?? "",
    school: post.postDetail?.school ?? "",
    bus: post.postDetail?.bus ?? "",
    restaurant: post.postDetail?.restaurant ?? "",
  });

  const [images, setImages] = useState(post.images || []);

  useEffect(() => {
    setDescription(post.postDetail?.desc || "");
    setImages(post.images || []);
    setForm({
      title: post.title || "",
      price: post.price ?? "",
      address: post.address || "",
      city: post.city || "",
      bedroom: post.bedroom ?? "",
      bathroom: post.bathroom ?? "",
      type: post.type || "rent",
      property: post.property || "apartment",
      latitude: post.latitude || "",
      longitude: post.longitude || "",
      furnishing: post.furnishing || "",
      postedBy: post.postedBy || "",
      tenantPreference: post.tenantPreference || [],
      videoUrl: post.videoUrl || "",
      utilities: post.postDetail?.utilities || "",
      pet: post.postDetail?.pet || "",
      income: post.postDetail?.income || "",
      size: post.postDetail?.size ?? "",
      school: post.postDetail?.school ?? "",
      bus: post.postDetail?.bus ?? "",
      restaurant: post.postDetail?.restaurant ?? "",
    });
  }, [post]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTenantPreference = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setForm((previous) => ({
      ...previous,
      tenantPreference: selected,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0 ||
      !Number.isInteger(Number(form.price)) ||
      form.bedroom === "" ||
      Number(form.bedroom) < 0 ||
      form.bathroom === "" ||
      Number(form.bathroom) < 0 ||
      !form.latitude.trim() ||
      !form.longitude.trim() ||
      !description.trim() ||
      images.length === 0
    ) {
      setError("Please complete the required fields and keep at least one image.");
      return;
    }

    if (
      !Number.isFinite(Number(form.bedroom)) ||
      !Number.isInteger(Number(form.bedroom)) ||
      !Number.isFinite(Number(form.bathroom)) ||
      !Number.isInteger(Number(form.bathroom))
    ) {
      setError("Bedrooms and bathrooms must be valid whole numbers.");
      return;
    }

    const optionalNumbers = [
      ["size", "Property size"],
      ["school", "Distance to school"],
      ["bus", "Distance to bus stop"],
      ["restaurant", "Distance to restaurant"],
    ];

    for (const [name, label] of optionalNumbers) {
      if (
        form[name] !== "" &&
        (!Number.isFinite(Number(form[name])) || Number(form[name]) < 0)
      ) {
        setError(`${label} must be a valid non-negative number.`);
        return;
      }
    }

    setLoading(true);

    try {
      const postData = {
        title: form.title.trim(),
        price: Number(form.price),
        address: form.address.trim(),
        city: form.city.trim(),
        bedroom: Number(form.bedroom),
        bathroom: Number(form.bathroom),
        type: form.type,
        property: form.property,
        latitude: form.latitude.trim(),
        longitude: form.longitude.trim(),
        images,
        furnishing: form.furnishing || null,
        postedBy: form.postedBy || null,
        tenantPreference: form.tenantPreference,
        videoUrl: form.videoUrl.trim() || null,
      };

      const postDetail = {
        desc: description,
        utilities: form.utilities || null,
        pet: form.pet || null,
        income: form.income || null,
        size: form.size === "" ? null : Number(form.size),
        school: form.school === "" ? null : Number(form.school),
        bus: form.bus === "" ? null : Number(form.bus),
        restaurant: form.restaurant === "" ? null : Number(form.restaurant),
      };

      await apiRequest.put(`/posts/${post.id}`, {
        postData,
        postDetail,
      });

      navigate(`/${post.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update the property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    ["title", "Property title", "text", true],
    ["price", "Price", "number", true],
    ["address", "Address / locality", "text", true],
    ["city", "City", "text", true],
    ["bedroom", "Bedrooms", "number", true],
    ["bathroom", "Bathrooms", "number", true],
    ["latitude", "Latitude", "text", true],
    ["longitude", "Longitude", "text", true],
    ["videoUrl", "Video URL", "url", false],
  ];

  const numberFields = [
    ["size", "Property size"],
    ["school", "Distance to school"],
    ["bus", "Distance to bus stop"],
    ["restaurant", "Distance to restaurant"],
  ];

  const dropdowns = [
    {
      name: "furnishing",
      label: "Furnishing",
      options: [
        ["furnished", "Furnished"],
        ["semi-furnished", "Semi-furnished"],
        ["unfurnished", "Unfurnished"],
      ],
    },
    {
      name: "postedBy",
      label: "Posted by",
      options: [
        ["owner", "Owner"],
        ["agent", "Agent"],
        ["builder", "Builder"],
      ],
    },
    {
      name: "utilities",
      label: "Utilities",
      options: [
        ["included", "Included in rent"],
        ["excluded", "Excluded from rent"],
        ["partially-included", "Partially included"],
      ],
    },
    {
      name: "pet",
      label: "Pet policy",
      options: [
        ["allowed", "Pets allowed"],
        ["not-allowed", "Pets not allowed"],
        ["case-by-case", "Case by case"],
      ],
    },
  ];

  const tenantOptions = [
    ["family", "Family"],
    ["bachelors", "Bachelors"],
    ["students", "Students"],
    ["professionals", "Working professionals"],
    ["couples", "Couples"],
  ];

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Property</h1>

        <form onSubmit={handleSubmit}>
          {textFields.map(([name, label, type, required]) => (
            <div className="item" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                min={type === "number" ? 0 : undefined}
                step={type === "number" ? 1 : undefined}
                required={required}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="item">
            <label htmlFor="type">Listing type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </div>

          <div className="item">
            <label htmlFor="property">Property type</label>
            <select
              id="property"
              name="property"
              value={form.property}
              onChange={handleChange}
              required
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>

          {dropdowns.map(({ name, label, options }) => (
            <div className="item" key={name}>
              <label htmlFor={name}>{label}</label>
              <select
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
              >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(([value, optionLabel]) => (
                  <option key={value} value={value}>
                    {optionLabel}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="item">
            <label htmlFor="tenantPreference">Tenant preferences</label>
            <select
              id="tenantPreference"
              multiple
              value={form.tenantPreference}
              onChange={handleTenantPreference}
            >
              {tenantOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="imageHint">
              Hold Ctrl (Windows) or Command (Mac) to select multiple options.
            </p>
          </div>

          <div className="item">
            <label htmlFor="income">Income requirements</label>
            <select
              id="income"
              name="income"
              value={form.income}
              onChange={handleChange}
            >
              <option value="">No specific requirement</option>
              <option value="proof-required">Proof of income required</option>
              <option value="stable-income">Stable income required</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {numberFields.map(([name, label]) => (
            <div className="item" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type="number"
                min="0"
                step="any"
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="item description">
            <label>Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="item">
            <label>Existing image URLs</label>
            <p className="imageHint">
              Keep one URL per line. This preserves your current images without requiring a new upload service.
            </p>
            <textarea
              rows={4}
              value={images.join("\n")}
              onChange={(event) =>
                setImages(
                  event.target.value
                    .split("\n")
                    .map((url) => url.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;
