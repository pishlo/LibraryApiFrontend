import { useEffect, useState } from "react";
import api from "../api/api";

interface Book {
  id: number;
  title: string;
  genre: string;
  year: number;
  authorId: number;
  authorName?: string;
}

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Book | null>(null);

  const [newItem, setNewItem] = useState({
    title: "",
    genre: "",
    year: "",
    authorId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<Book[]>("/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- CREATE ---
  const handleCreateClick = () => setCreating(true);
  const handleCancelCreate = () => {
    setCreating(false);
    setNewItem({ title: "", genre: "", year: "", authorId: "" });
  };

  const handleSaveCreate = async () => {
    try {
      const response = await api.post("/books", {
        title: newItem.title,
        genre: newItem.genre,
        year: Number(newItem.year),
        authorId: Number(newItem.authorId),
      });
      setBooks([...books, response.data]);
      handleCancelCreate();
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  // --- EDIT ---
  const handleEditClick = (item: Book) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedItem(null);
  };
  const handleSaveEdit = async () => {
    if (!editedItem) return;
    try {
      await api.put(`/books/${editedItem.id}`, {
        title: editedItem.title,
        genre: editedItem.genre,
        year: editedItem.year,
        authorId: editedItem.authorId,
      });
      const { data: updatedBook } = await api.get<Book>(`/books/${editedItem.id}`);
      setBooks((prev) => prev.map((b) => (b.id === editedItem.id ? updatedBook : b)));
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading) {
    return (
      <div className="page flex-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Books</h2>
        {!creating && editingId === null && (
          <button className="Btn" onClick={handleCreateClick}>
            <div className="sign">+</div>
            <div className="text">Create</div>
          </button>
        )}
      </div>

      <div className="cards-grid">
        {books.map((book) => (
          <div key={book.id} className="card">
            {editingId === book.id && editedItem ? (
              <>
                <div className="creating">
                  <input
                    type="text"
                    value={editedItem.title}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editedItem.genre}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, genre: e.target.value })
                    }
                    placeholder="Genre"
                  />
                  <input
                    type="number"
                    value={editedItem.year}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, year: Number(e.target.value) })
                    }
                    placeholder="Year"
                  />
                  <input
                    type="number"
                    value={editedItem.authorId}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        authorId: Number(e.target.value),
                      })
                    }
                    placeholder="Author ID"
                  />
                </div>
                <div className="card-actions">
                  <button className="green-btn" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button className="red-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="card-subtext">ID: {book.id}</p>
                <h3 className="card-title">{book.title}</h3>
                <p className="card-subtext">{book.genre || "Unknown Genre"}</p>
                <p className="card-subtext">Published: {book.year}</p>
                <p className="card-subtext">
                  Author: {book.authorName} (ID: {book.authorId})
                </p>
                <div className="card-actions">
                  <button
                    className="green-btn"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="red-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {creating && (
          <div className="card">
            <div className="creating">
              <input
                type="text"
                placeholder="Title"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Genre"
                value={newItem.genre}
                onChange={(e) =>
                  setNewItem({ ...newItem, genre: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Year"
                value={newItem.year}
                onChange={(e) =>
                  setNewItem({ ...newItem, year: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Author ID"
                value={newItem.authorId}
                onChange={(e) =>
                  setNewItem({ ...newItem, authorId: e.target.value })
                }
              />
            </div>
            <div className="card-actions">
              <button className="green-btn" onClick={handleSaveCreate}>
                Save
              </button>
              <button className="red-btn" onClick={handleCancelCreate}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
