import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
function ProfileUpdatePage() {
  const[error,setError] = useState(null);
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar,setAvatar] = useState([]);
  const handleUpdate = async(e) => {
    e.preventDefault();
    console.log("Current User:", currentUser); // 👈 Add here
    // Handle profile update logic here
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData.entries());
    try {
     const res = await apiRequest.put(
  `/users/${currentUser.id}`,
  {
    username,
    email,
    password,
    avatar: avatar[0],
  }
);
      updateUser(res.data);
    } catch (error) {
        console.log(error.response); // 👈 Add this too
      setError("Error updating profile");
      console.error("Error updating profile:", error);
    }
  }
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleUpdate}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button type="submit">Update</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] ||currentUser.avatar || "/noavatar.png"} alt="" className="avatar" />
        <UploadWidget uwConfig={
          {
            cloudName:"dkcgjpj0k",
            uploadPreset:"estate",
            multiple:false,
            maxImageFileSize:2000000,
            folder:"avatar",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}
export default ProfileUpdatePage;
