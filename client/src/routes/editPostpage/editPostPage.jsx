
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import "./editPostPage.scss";

function EditPostPage() {
  const post = useLoaderData();
  const navigate = useNavigate();

  const [description, setDescription] = useState(
    post.postDetail?.desc || ""
  );
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
    tenantPreference: (post.tenantPreference || []).join(", "),
    videoUrl: post.videoUrl || "",
    utilities: post.postDetail?.utilities || "",
    pet: post.postDetail?.pet || "",
    income: post.postDetail?.income || "",
    size: post.postDetail?.size ?? "",
    school: post.postDetail?.school ?? "",
    bus: post.postDetail?.bus ?? "",
    restaurant: post.postDetail?.restaurant ?? "",
  });

  const [images, setImages] = useState(
    post.images || []
  );

  useEffect(() => {
    setDescription(post.postDetail?.desc || "");
    setImages(post.images || []);
  }, [post]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
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
      Number(form.price) < 0 ||
      !Number.isInteger(Number(form.price)) ||
      !form.bedroom ||
      !form.bathroom ||
      !form.latitude ||
      !form.longitude ||
      !description.trim() ||
      images.length === 0
    ) {
      setError("Please complete the required fields and keep at least one image.");
      return;
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
        latitude: form.latitude,
        longitude: form.longitude,
        images,
        furnishing: form.furnishing || null,
        postedBy: form.postedBy || null,
        tenantPreference: form.tenantPreference
          ? form.tenantPreference.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        videoUrl: form.videoUrl || null,
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

  const fields = [
    ["title", "Property title", "text"],
    ["price", "Price", "number"],
    ["address", "Address / locality", "text"],
    ["city", "City", "text"],
    ["bedroom", "Bedrooms", "number"],
    ["bathroom", "Bathrooms", "number"],
    ["latitude", "Latitude", "text"],
    ["longitude", "Longitude", "text"],
    ["furnishing", "Furnishing", "text"],
    ["postedBy", "Posted by", "text"],
    ["tenantPreference", "Tenant preference (comma-separated)", "text"],
    ["videoUrl", "Video URL", "url"],
    ["size", "Property size", "number"],
    ["school", "Distance to school", "number"],
    ["bus", "Distance to bus stop", "number"],
    ["restaurant", "Distance to restaurant", "number"],
    ["utilities", "Utilities", "text"],
    ["pet", "Pet policy", "text"],
    ["income", "Income requirements", "text"],
  ];

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Property</h1>

        <form onSubmit={handleSubmit}>
          {fields.map(([name, label, type]) => (
            <div className="item" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                min={type === "number" ? 0 : undefined}
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
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>

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
