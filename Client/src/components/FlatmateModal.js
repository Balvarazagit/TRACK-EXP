// components/FlatmateModal.js
import React, { useState } from 'react';
import { useFlatmate } from '../context/FlatmateContext';
import { useAuth } from '../context/AuthContext';
import '../styles/FlatmateModal.css';
import { toast } from 'react-toastify';

const FlatmateModal = ({ close }) => {
  const { user } = useAuth();
  const { group, groupHistory, setGroup,removeGroupFromHistory   } = useFlatmate();

  const [mode, setMode] = useState('create');
  const [joinCode, setJoinCode] = useState('');
  const [result, setResult] = useState({ message: '', isError: false });
  const [loading, setLoading] = useState(false);
  const [copiedGroupId, setCopiedGroupId] = useState(null);

  const handleCreate = async () => {
    setLoading(true);
    setResult({ message: '', isError: false });
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/group/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setGroup(data.group);
        toast.success(`Group created! Code: ${data.group.code}`);
      } else {
        setResult({ message: data.error || 'Failed to create group', isError: true });
      }
    } catch (err) {
      setResult({ message: 'Network error. Please try again.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      setResult({ message: 'Please enter a group code', isError: true });
      return;
    }
    setLoading(true);
    setResult({ message: '', isError: false });
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/group/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCode, userId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setGroup(data.group);
       toast.success(`Joined group ${data.group.name || data.group.code}`);
        close()
      } else {
        setResult({ message: data.error || 'Failed to join group', isError: true });
      }
    } catch (err) {
      setResult({ message: 'Network error. Please try again.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result.message.includes('Share this code:')) {
      const code = result.message.split(':')[1].trim();
      navigator.clipboard.writeText(code);
      setCopiedGroupId(true);
      setTimeout(() => setCopiedGroupId(false), 2000);
    }
  };

const handleDeleteGroup = async (groupId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this group?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/group/${groupId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      removeGroupFromHistory(groupId);
      toast.success("Group deleted successfully!"); // ✅ update local storage and UI
      setCopiedGroupId(null);
    } else {
      const data = await res.json();
     toast.error(data.error || "Failed to delete group");
    }
  } catch (error) {
    console.error("Delete error:", error);
toast.error("Server error while deleting group");
  }
};


  return (
    <div className="flate-modal-overlay" onClick={close}>
      <div className="flatmate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-icon">👥</div>
          <h2>Flatmate Group</h2>
          <p>Create or join a shared expense group</p>
        </div>

       {groupHistory.length > 0 ? (
  <div className="group-history-list">
    <h4>📜 Your Previous Groups:</h4>
    {groupHistory.filter(g => g.creator === user.id).length > 0 ? (
      <ul>
        {groupHistory
          .filter(g => g.creator === user.id)
          .map((g) => (
            <li key={g._id}>
              <span>🔑 {g.code}</span>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(g.code);
                  setCopiedGroupId(g._id);
                  setTimeout(() => setCopiedGroupId(null), 2000);
                }}
              >
                {copiedGroupId === g._id ? "✓ Copied!" : "Copy"}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteGroup(g._id)}
              >
                🗑️
              </button>
            </li>
          ))}
      </ul>
    ) : (
      <p className="empty-group-message">You haven't created any groups yet.</p>
    )}
  </div>
) : null}



        <div className="tabs">
          <button
            className={`tab-btn ${mode === "create" ? "active" : ""}`}
            onClick={() => {
              setMode("create");
              setResult({ message: "", isError: false });
            }}
          >
            Create New Group
          </button>
          <button
            className={`tab-btn ${mode === "join" ? "active" : ""}`}
            onClick={() => {
              setMode("join");
              setResult({ message: "", isError: false });
            }}
          >
            Join Existing Group
          </button>
        </div>

        <div className="modal-body">
          {mode === "create" ? (
            <div className="create-section">
              <p className="section-description">
                Create a new group and invite your flatmates by sharing the
                group code.
              </p>
              <button
                className="action-btn primary"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Generate Group Code"
                )}
              </button>
            </div>
          ) : (
            <div className="join-section">
              <p className="section-description">
                Enter the group code provided by your flatmate to join their
                expense group.
              </p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter 6-digit group code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  maxLength="6"
                  pattern="[A-Za-z0-9]{6}"
                  title="6-character alphanumeric code"
                />
                <button
                  className="action-btn primary"
                  onClick={handleJoin}
                  disabled={loading || !joinCode.trim()}
                >
                  {loading ? <span className="spinner"></span> : "Join Group"}
                </button>
              </div>
            </div>
          )}

          {result.message && (
            <div
              className={`result-message ${
                result.isError ? "error" : "success"
              }`}
            >
              <p>{result.message}</p>
              {result.message.includes("Share this code:") && (
                <button
                  className="copy-btn"
                  onClick={copyToClipboard}
                  aria-label="Copy to clipboard"
                >
                  {copiedGroupId ? "✓ Copied!" : "Copy Code"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlatmateModal;