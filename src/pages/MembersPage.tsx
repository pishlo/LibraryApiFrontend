import { useEffect, useState } from "react";
import api from "../api/api";

interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
}

function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Member | null>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<Member[]>("/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
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
    setNewItem({ name: "", email: "", phoneNumber: "" });
  };

  const handleSaveCreate = async () => {
    try {
      const response = await api.post("/members", {
        name: newItem.name,
        email: newItem.email,
        phoneNumber: newItem.phoneNumber || undefined,
      });
      setMembers([...members, response.data]);
      handleCancelCreate();
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  // --- EDIT ---
  const handleEditClick = (item: Member) => {
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
      await api.put(`/members/${editedItem.id}`, {
        name: editedItem.name,
        email: editedItem.email,
        phoneNumber: editedItem.phoneNumber || undefined,
      });
      const { data: updatedMember } = await api.get<Member>(`/members/${editedItem.id}`);
      setMembers((prev) => prev.map((m) => (m.id === editedItem.id ? updatedMember : m)));
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting member:", error);
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
        <h2>Members</h2>
        {!creating && editingId === null && (
          <button className="Btn" onClick={handleCreateClick}>
            <div className="sign">+</div>
            <div className="text">Create</div>
          </button>
        )}
      </div>

      <div className="cards-grid">
        {members.map((member) => (
          <div key={member.id} className="card">
            {editingId === member.id && editedItem ? (
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
                    type="email"
                    value={editedItem.email}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={editedItem.phoneNumber || ""}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, phoneNumber: e.target.value })
                    }
                    placeholder="Phone Number"
                  />
                </div>
                <div className="card-actions">
                  <button className="green-btn" onClick={handleSaveEdit}>Save</button>
                  <button className="red-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="card-subtext">ID: {member.id}</p>
                <h3 className="card-title">{member.name}</h3>
                <p className="card-subtext">Email: {member.email}</p>
                <p className="card-subtext">Phone: {member.phoneNumber || "N/A"}</p>
                <div className="card-actions">
                  <button className="green-btn" onClick={() => handleEditClick(member)}>Edit</button>
                  <button className="red-btn" onClick={() => handleDelete(member.id)}>Delete</button>
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
                type="email"
                placeholder="Email"
                value={newItem.email}
                onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newItem.phoneNumber}
                onChange={(e) => setNewItem({ ...newItem, phoneNumber: e.target.value })}
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

export default MembersPage;
