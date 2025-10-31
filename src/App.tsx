import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // our new Navbar
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import AuthorsPage from "./pages/AuthorsPage";
import MembersPage from "./pages/MembersPage";
import BorrowRecordsPage from "./pages/BorrowRecordsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/borrow-records" element={<BorrowRecordsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
