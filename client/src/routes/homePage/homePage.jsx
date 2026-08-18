import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
function HomePage() {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Your Perfect Place to Call Home</h1>
            <p>
            Discover beautiful properties in the right location and find a place that fits your lifestyle. Explore trusted listings, compare your options, and take the next step toward your dream home with SahooVista.
            </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>1+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>2</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>200+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
