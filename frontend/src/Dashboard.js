// frontend/src/Dashboard.js
import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [pickups, setPickups] = useState([]);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pickups');
      const data = await res.json();
      setPickups(data);
    } catch (err) {
      console.error('Failed to fetch pickups', err);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    if (!description) {
      setStatusMessage('Description cannot be empty.');
      return;
    }
    try {
      if (editingId == null) {
        const res = await fetch('http://localhost:5000/api/pickups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, weight })
        });
        if (res.ok) {
          const newItem = await res.json();
          setPickups([...pickups, newItem]);
          setStatusMessage('New pickup added.');
        } else {
          const errData = await res.json();
          setStatusMessage(errData.error || 'Error adding pickup.');
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/pickups/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, weight })
        });
        if (res.ok) {
          const updatedItem = await res.json();
          setPickups(pickups.map(p => p.id === editingId ? updatedItem : p));
          setStatusMessage('Pickup updated.');
        } else {
          setStatusMessage('Error updating pickup (not found).');
        }
      }
    } catch (err) {
      console.error('Error saving pickup', err);
      setStatusMessage('Failed to save pickup.');
    }
    setEditingId(null);
    setDescription('');
    setWeight('');
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDescription(item.description);
    setWeight(item.weight || '');
    setStatusMessage('Editing pickup ID ' + item.id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pickups/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPickups(pickups.filter(p => p.id !== id));
        setStatusMessage('Pickup deleted.');
      } else {
        setStatusMessage('Error deleting pickup (not found).');
      }
    } catch (err) {
      console.error('Error deleting pickup', err);
      setStatusMessage('Failed to delete pickup.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>Waste Pickup Dashboard</h2>
      <form onSubmit={handleAddOrUpdate} style={{ marginBottom: '20px' }}>
        <div>
          <input
            id="descriptionInput"
            type="text"
            placeholder="Pickup Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <input
          id="weightInput"
          type="text"
          placeholder="Weight (kg) - optional"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button id="saveButton" type="submit">
          {editingId ? 'Update Pickup' : 'Add Pickup'}
        </button>
        {editingId &&
          <button type="button" onClick={() => {
            setEditingId(null);
            setDescription('');
            setWeight('');
            setStatusMessage('Edit cancelled.');
          }}>
            Cancel
          </button>
        }
      </form>

      {statusMessage && <div id="statusMsg" style={{ marginBottom: '10px', color: 'blue' }}>{statusMessage}</div>}

      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Weight (kg)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map(item => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.weight || '-'}</td>
              <td>
                <button className="editBtn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="deleteBtn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {pickups.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No pickups available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
