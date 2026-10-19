
import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
  const image =
    item.images?.find((src) => typeof src === "string" && src.trim()) ||
    "/placeholder.png";

  return (
    <article className="card">
      <Link
        to={`/${item.id}`}
        className="imageContainer"
        aria-label={`View ${item.title}`}
      >
        <img
          src={image}
          alt={item.title || "Property"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        <span className="propertyBadge">
          {item.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      </Link>

      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>
            {item.title}
          </Link>
        </h2>

        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address || item.city || "Location unavailable"}</span>
        </p>

        <p className="price">
          <span className="priceValue">
            ₹{Number(item.price || 0).toLocaleString("en-IN")}
          </span>
          {item.type === "rent" && (
            <span className="pricePeriod"> / month</span>
          )}
        </p>

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} Bedroom</span>
            </div>

            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} Bathroom</span>
            </div>
          </div>

          <div className="icons">
            <button
              type="button"
              className="icon"
              aria-label="Save property"
              title="Save property"
              onClick={() => {
                // Connect your existing save-property API here.
              }}
            >
              <img src="/save.png" alt="" />
            </button>

            <Link
              to={`/${item.id}`}
              className="icon"
              aria-label="View property details"
              title="View property"
            >
              <img src="/chat.png" alt="" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Card;
