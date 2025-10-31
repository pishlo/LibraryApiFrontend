import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to the Library</h1>
      <p>Explore books, authors, members, and manage borrow records all in one place.</p>
      <div>
        <Link to="/books"><button className="home-buttons">Books</button></Link>
        <Link to="/authors"><button className="home-buttons">Authors</button></Link>
        <Link to="/members"><button className="home-buttons">Members</button></Link>
        <Link to="/borrow-records"><button className="home-buttons">Borrow Records</button></Link>
      </div>
    </div>
  );
}

export default HomePage;
