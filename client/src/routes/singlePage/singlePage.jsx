
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOwner = currentUser?.id === post.userId;

  const handleMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (isOwner) {
      alert("You cannot message yourself!");
      return;
    }

    try {
      await apiRequest.post("/chats", {
        receiverId: post.userId,
      });

      navigate("/profile");
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Could not start the chat. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((previous) => !previous);

    try {
      await apiRequest.post("/users/save", {
        postId: post.id,
      });
    } catch (err) {
      console.error("Failed to save property:", err);
      setSaved((previous) => !previous);
      alert("Could not save the property. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      await apiRequest.delete(`/posts/${post.id}`);
      alert("Property deleted successfully.");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert(
        err.response?.data?.message ||
          "Could not delete the property. Please try again."
      );
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images || []} />

          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>

                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>

                <div className="price">
                  ₹ {Number(post.price).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="user">
                <img src={post.user?.avatar || "/noavatar.jpg"} alt="" />
                <span>{post.user?.username || "Property Owner"}</span>
              </div>
            </div>

            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  post.postDetail?.desc || ""
                ),
              }}
            />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>

          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                <p>
                  {post.postDetail?.utilities === "owner"
                    ? "Owner is responsible"
                    : "Tenant is responsible"}
                </p>
              </div>
            </div>

            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>
                  {post.postDetail?.pet === "allowed"
                    ? "Pets Allowed"
                    : "Pets not Allowed"}
                </p>
              </div>
            </div>

            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail?.income || "Not specified"}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>

          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail?.size || 0} sqft</span>
            </div>

            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>

            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathrooms</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>

          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail?.school ?? "N/A"}m away</p>
              </div>
            </div>

            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail?.bus ?? "N/A"}m away</p>
              </div>
            </div>

            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail?.restaurant ?? "N/A"}m away</p>
              </div>
            </div>
          </div>

          <p className="title">Location</p>

          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            {!isOwner && (
              <button onClick={handleMessage}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
            )}

            {!isOwner && (
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: saved ? "#fece51" : "white",
                }}
              >
                <img src="/save.png" alt="" />
                {saved ? "Place Saved" : "Save the Place"}
              </button>
            )}

            {isOwner && (
              <>
                <button onClick={() => navigate(`/edit/${post.id}`)}>
                  Edit Property
                </button>

                <button
                  onClick={handleDelete}
                  style={{ borderColor: "#dc2626", color: "#dc2626" }}
                >
                  Delete Property
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
