import { useEffect, useState } from "react";
import api from "../api/api";

interface BorrowRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  memberId: number;
  memberName: string;
  borrowDate: string;
  returnDate?: string;
}

function BorrowRecordsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newRecord, setNewRecord] = useState({ bookId: "", memberId: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<BorrowRecord[]>("/borrowrecords");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching borrow records:", error);
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
    setNewRecord({ bookId: "", memberId: "" });
  };

  const handleSaveCreate = async () => {
    try {
      await api.post("/borrowrecords", {
        bookId: Number(newRecord.bookId),
        memberId: Number(newRecord.memberId),
      });
  
      // Refresh the full list
      const { data: allRecords } = await api.get("/borrowrecords");
      setRecords(allRecords);
  
      handleCancelCreate();
    } catch (error: any) {
      console.error("Error creating borrow record:", error.response?.data || error);
      alert(error.response?.data || "Error creating borrow record");
    }
  };
  

  // --- RETURN ---
  const handleReturn = async (id: number) => {
    try {
      await api.put(`/borrowrecords/return/${id}`);
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, returnDate: new Date().toISOString() } : r
        )
      );
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/borrowrecords/${id}`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting borrow record:", error);
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
        <h2>Borrow Records</h2>
        {!creating && (
          <button className="Btn" onClick={handleCreateClick}>
            <div className="sign">+</div>
            <div className="text">Create</div>
          </button>
        )}
      </div>

      <div className="cards-grid">
        {records.map((record) => {
          const isReturned = !!record.returnDate;
          return (
            <div
              key={record.id}
              className="card"
              style={{
                backgroundColor: isReturned ? "#2f2f2f" : "#1a1a1a",
                opacity: isReturned ? 0.7 : 1,
              }}
            >
              <p className="card-subtext">ID: {record.id}</p>
              <p className="card-subtext">Book: {record.bookTitle} (ID: {record.bookId})</p>
              <p className="card-subtext">Member: {record.memberName} (ID: {record.memberId})</p>
              <p className="card-subtext">Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</p>
              <p className="card-subtext">
                Returned: {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : "Not returned"}
              </p>
              <div className="card-actions">
                {!isReturned && (
                  <button className="green-btn" onClick={() => handleReturn(record.id)}>Return</button>
                )}
                <button className="red-btn" onClick={() => handleDelete(record.id)}>Delete</button>
              </div>
            </div>
          );
        })}

        {/* NEW BORROW RECORD CARD */}
        {creating && (
          <div className="card">
            <div className="creating">
              <input
                type="number"
                placeholder="Book ID"
                value={newRecord.bookId}
                onChange={(e) => setNewRecord({ ...newRecord, bookId: e.target.value })}
              />
              <input
                type="number"
                placeholder="Member ID"
                value={newRecord.memberId}
                onChange={(e) => setNewRecord({ ...newRecord, memberId: e.target.value })}
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

export default BorrowRecordsPage;
