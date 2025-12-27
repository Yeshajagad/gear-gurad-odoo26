import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEquipment, createEquipment, deleteEquipment } from '../services/api';
import Modal from '../components/Modal';
import EquipmentForm from '../components/EquipmentForm';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEquipment = async (formData) => {
    try {
      await createEquipment(formData);
      setShowModal(false);
      fetchEquipment();
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(id);
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment');
      }
    }
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serial_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filterCategory || eq.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card-header">
        <h1>Equipment Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Equipment
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />

          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Categories</option>
            <option value="MACHINE">Machine</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="COMPUTER">Computer</option>
            <option value="TOOL">Tool</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Serial Number</th>
              <th>Category</th>
              <th>Department</th>
              <th>Team</th>
              <th>Requests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEquipment.map((eq) => (
              <tr key={eq.id}>
                <td>
                  <Link
                    to={`/equipment/${eq.id}`}
                    style={{ fontWeight: 'bold', color: '#3498db' }}
                  >
                    {eq.name}
                  </Link>
                </td>

                <td>{eq.serial_number}</td>

                <td>
                  <span className="badge">{eq.category}</span>
                </td>

                <td>{eq.department || '-'}</td>

                <td>{eq.maintenance_team_name || '-'}</td>

                <td>
                  <span className="badge badge-new">
                    {eq.open_request_count} open
                  </span>
                </td>

                <td>
                  {eq.is_scrapped ? (
                    <span className="badge badge-scrap">Scrapped</span>
                  ) : (
                    <span className="badge badge-repaired">Active</span>
                  )}
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Link
                      to={`/equipment/${eq.id}`}
                      className="btn btn-primary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      View
                    </Link>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(eq.id)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEquipment.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
            }}
          >
            No equipment found
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Equipment"
      >
        <EquipmentForm
          onSubmit={handleCreateEquipment}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default EquipmentList;
