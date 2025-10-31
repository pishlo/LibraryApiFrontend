import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo nav-links"><Link to="/">Library App</Link></div>
      <div className="nav-links">
        <Link to="/books">Books</Link>
        <Link to="/authors">Authors</Link>
        <Link to="/members">Members</Link>
        <Link to="/borrow-records">Borrow Records</Link>
      </div>
    </nav>
  );
}

export default Navbar;
