import React, { useState, useEffect } from 'react';
import { getEquipment, createMaintenanceRequest, getUsers, getMaintenanceRequests } from '../services/api';
import Modal from '../components/Modal';
import KanbanBoard from '../components/KanbanBoard';

function MaintenanceRequests() {
  const [showModal, setShowModal] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment: '',
    request_type: 'CORRECTIVE',
    priority: 'MEDIUM',
    scheduled_date: '',
    requested_by: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [equipmentRes, usersRes, requestsRes] = await Promise.all([
        getEquipment(),
        getUsers(),
        getMaintenanceRequests() // fetch existing requests
      ]);
      setEquipment(equipmentRes.data);
      setUsers(usersRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        equipment: parseInt(formData.equipment),
        requested_by: parseInt(formData.requested_by) || null,
        scheduled_date: formData.scheduled_date || null
      };
      
      await createMaintenanceRequest(submitData);
      setShowModal(false);
      setFormData({
        subject: '',
        description: '',
        equipment: '',
        request_type: 'CORRECTIVE',
        priority: 'MEDIUM',
        scheduled_date: '',
        requested_by: ''
      });

      fetchData(); // refresh requests to update Kanban board
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create maintenance request');
    }
  };

  // Group requests by stage for Kanban
  const stages = ['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP'];
  const requestsByStage = {};
  stages.forEach(stage => {
    requestsByStage[stage] = requests.filter(req => req.stage === stage);
  });

  return (
    <div className="container">
      <div className="card-header">
        <h1>Maintenance Requests</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Request
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ marginTop: '20px' }}>
        <KanbanBoard requestsByStage={requestsByStage} />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Maintenance Request"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              type="text"
              name="subject"
              className="form-input"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="e.g., Leaking Oil"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the issue"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Equipment *</label>
            <select
              name="equipment"
              className="form-select"
              value={formData.equipment}
              onChange={handleChange}
              required
            >
              <option value="">Select Equipment</option>
              {equipment.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.serial_number}) - {eq.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Request Type</label>
            <select
              name="request_type"
              className="form-select"
              value={formData.request_type}
              onChange={handleChange}
            >
              <option value="CORRECTIVE">Corrective (Breakdown)</option>
              <option value="PREVENTIVE">Preventive (Routine Checkup)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Date/Time</label>
            <input
              type="datetime-local"
              name="scheduled_date"
              className="form-input"
              value={formData.scheduled_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requested By</label>
            <select
              name="requested_by"
              className="form-select"
              value={formData.requested_by}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">
              Create Request
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MaintenanceRequests;