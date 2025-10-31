import { useEffect, useState } from "react";
import api from "../api/api";

interface Author {
  id: number;
  name: string;
  country?: string;
}

function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Author | null>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    country: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<Author[]>("/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
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
    setNewItem({ name: "", country: "" });
  };

  const handleSaveCreate = async () => {
    try {
      const response = await api.post("/authors", {
        name: newItem.name,
        country: newItem.country || undefined,
      });
      setAuthors([...authors, response.data]);
      handleCancelCreate();
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  // --- EDIT ---
  const handleEditClick = (item: Author) => {
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
      await api.put(`/authors/${editedItem.id}`, {
        name: editedItem.name,
        country: editedItem.country || undefined,
      });
      const { data: updatedAuthor } = await api.get<Author>(`/authors/${editedItem.id}`);
      setAuthors((prev) => prev.map((a) => (a.id === editedItem.id ? updatedAuthor : a)));
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/authors/${id}`);
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting author:", error);
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
        <h2>Authors</h2>
        {!creating && editingId === null && (
          <button className="Btn" onClick={handleCreateClick}>
            <div className="sign">+</div>
            <div className="text">Create</div>
          </button>
        )}
      </div>

      <div className="cards-grid">
        {authors.map((author) => (
          <div key={author.id} className="card">
            {editingId === author.id && editedItem ? (
              <>
                <div className="creating">
                  <input
                    type="text"
                    value={editedItem.name}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, name: e.target.value })
                    }
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editedItem.country || ""}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, country: e.target.value })
                    }
                    placeholder="Country"
                  />
                </div>
                <div className="card-actions">
                  <button className="green-btn" onClick={handleSaveEdit}>Save</button>
                  <button className="red-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="card-subtext">ID: {author.id}</p>
                <h3 className="card-title">{author.name}</h3>
                <p className="card-subtext">{author.country || "Unknown Country"}</p>
                <div className="card-actions">
                  <button className="green-btn" onClick={() => handleEditClick(author)}>Edit</button>
                  <button className="red-btn" onClick={() => handleDelete(author.id)}>Delete</button>
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
                placeholder="Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={newItem.country}
                onChange={(e) => setNewItem({ ...newItem, country: e.target.value })}
              />
            </div>
            <div className="card-actions">
              <button className="green-btn" onClick={handleSaveCreate}>Save</button>
              <button className="red-btn" onClick={handleCancelCreate}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorsPage;
