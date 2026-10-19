
import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const closeMenu = () => setOpen(false);

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png" alt="SahooVista logo" />
          <span>SahooVista</span>
        </Link>

        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        <Link to="/agents" onClick={closeMenu}>Agents</Link>
      </div>

      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || "/noavatar.png"}
              alt="Profile"
            />
            <span>{currentUser.username}</span>

            <Link
              to="/profile"
              className="profile"
              onClick={closeMenu}
            >
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Sign in</Link>
            <Link
              to="/register"
              className="register"
              onClick={closeMenu}
            >
              Sign up
            </Link>
          </>
        )}

        <button
          type="button"
          className="menuIcon"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((previous) => !previous)}
        >
          <img src="/menu.png" alt="" />
        </button>

        <div className={open ? "menu active" : "menu"}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/agents" onClick={closeMenu}>Agents</Link>

          {currentUser ? (
            <Link to="/profile" onClick={closeMenu}>Profile</Link>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Sign in</Link>
              <Link to="/register" onClick={closeMenu}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
