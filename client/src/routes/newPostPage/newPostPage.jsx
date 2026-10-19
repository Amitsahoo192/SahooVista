
import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const inputs = Object.fromEntries(formData.entries());

    const requiredFields = [
      "title",
      "price",
      "address",
      "city",
      "bedroom",
      "bathroom",
      "latitude",
      "longitude",
    ];

    for (const field of requiredFields) {
      if (!String(inputs[field] ?? "").trim()) {
        setError(`Please fill in ${field}.`);
        return;
      }
    }

    if (
      !Number.isInteger(Number(inputs.price)) ||
      Number(inputs.price) < 0
    ) {
      setError("Price must be a non-negative whole number.");
      return;
    }

    for (const field of ["bedroom", "bathroom"]) {
      if (
        !Number.isInteger(Number(inputs[field])) ||
        Number(inputs[field]) < 0
      ) {
        setError(`${field} must be a non-negative whole number.`);
        return;
      }
    }

    const latitude = Number(inputs.latitude);
    const longitude = Number(inputs.longitude);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }

    if (!description.replace(/<[^>]*>/g, "").trim()) {
      setError("Please provide a property description.");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one property image.");
      return;
    }

    const optionalNumbers = ["size", "school", "bus", "restaurant"];

    for (const field of optionalNumbers) {
      if (
        inputs[field] !== "" &&
        inputs[field] !== undefined &&
        (!Number.isInteger(Number(inputs[field])) ||
          Number(inputs[field]) < 0)
      ) {
        setError(`${field} must be a non-negative whole number.`);
        return;
      }
    }

    setLoading(true);

    try {
      const postData = {
        title: inputs.title.trim(),
        price: Number(inputs.price),
        address: inputs.address.trim(),
        city: inputs.city.trim(),
        bedroom: Number(inputs.bedroom),
        bathroom: Number(inputs.bathroom),
        type: inputs.type,
        property: inputs.property,
        latitude: String(latitude),
        longitude: String(longitude),
        images,
        furnishing: inputs.furnishing || null,
        postedBy: inputs.postedBy || null,
        tenantPreference: inputs.tenantPreference
          ? [inputs.tenantPreference]
          : [],
        videoUrl: inputs.videoUrl?.trim() || null,
      };

      const postDetail = {
        desc: description,
        utilities: inputs.utilities || null,
        pet: inputs.pet || null,
        income: inputs.income?.trim() || null,
        size: inputs.size === "" ? null : Number(inputs.size),
        school: inputs.school === "" ? null : Number(inputs.school),
        bus: inputs.bus === "" ? null : Number(inputs.bus),
        restaurant:
          inputs.restaurant === "" ? null : Number(inputs.restaurant),
      };

      const response = await apiRequest.post("/posts", {
        postData,
        postDetail,
      });

      navigate(`/${response.data.id}`);
    } catch (err) {
      console.error("Failed to create property:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create the property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Property</h1>

        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Property Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={150}
                placeholder="e.g. Spacious 2 BHK Apartment"
              />
            </div>

            <div className="item">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="address">Address / Locality *</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="e.g. Patia, Bhubaneswar"
              />
            </div>

            <div className="item">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="bedroom">Bedrooms / BHK *</label>
              <input
                id="bedroom"
                name="bedroom"
                type="number"
                min="0"
                step="1"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="bathroom">Bathrooms *</label>
              <input
                id="bathroom"
                name="bathroom"
                type="number"
                min="0"
                step="1"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="latitude">Latitude *</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="longitude">Longitude *</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="type">Listing Type *</label>
              <select id="type" name="type" defaultValue="rent">
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Type *</label>
              <select
                id="property"
                name="property"
                defaultValue="apartment"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="furnishing">Furnishing</label>
              <select
                id="furnishing"
                name="furnishing"
                defaultValue=""
              >
                <option value="">Not specified</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="postedBy">Posted By</label>
              <select
                id="postedBy"
                name="postedBy"
                defaultValue=""
              >
                <option value="">Not specified</option>
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="tenantPreference">Tenant Preference</label>
              <select
                id="tenantPreference"
                name="tenantPreference"
                defaultValue=""
              >
                <option value="">No preference specified</option>
                <option value="family">Family</option>
                <option value="bachelors">Bachelors</option>
                <option value="students">Students</option>
                <option value="professionals">Working professionals</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="videoUrl">Property Video URL</label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                id="utilities"
                name="utilities"
                defaultValue="shared"
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select
                id="pet"
                name="pet"
                defaultValue="not-allowed"
              >
                <option value="allowed">Pets allowed</option>
                <option value="not-allowed">Pets not allowed</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="income">Income Requirements</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Optional income requirements"
              />
            </div>

            <div className="item">
              <label htmlFor="size">Property Size (sq. ft.)</label>
              <input
                id="size"
                name="size"
                type="number"
                min="0"
                step="1"
              />
            </div>

            <div className="item">
              <label htmlFor="school">Distance to School</label>
              <input
                id="school"
                name="school"
                type="number"
                min="0"
                step="1"
              />
            </div>

            <div className="item">
              <label htmlFor="bus">Distance to Bus Stop</label>
              <input
                id="bus"
                name="bus"
                type="number"
                min="0"
                step="1"
              />
            </div>

            <div className="item">
              <label htmlFor="restaurant">Distance to Restaurant</label>
              <input
                id="restaurant"
                name="restaurant"
                type="number"
                min="0"
                step="1"
              />
            </div>

            <div className="item description">
              <label htmlFor="description">Property Description *</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Describe the property, amenities and nearby facilities..."
              />
            </div>

            <button
              className="sendButton"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Property..." : "Publish Property"}
            </button>

            {error && (
              <p className="formError" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        <h2>Property Images</h2>

        {images.map((image, index) => (
          <div className="uploadedImage" key={`${image}-${index}`}>
            <img src={image} alt={`Property ${index + 1}`} />
            <button
              type="button"
              onClick={() =>
                setImages((current) =>
                  current.filter((_, imageIndex) => imageIndex !== index)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}

        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dkcgjpj0k",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
