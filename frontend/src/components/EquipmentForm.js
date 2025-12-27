import React, { useState, useEffect } from 'react';
import { getTeams, getTechnicians } from '../services/api';

function EquipmentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    category: 'OTHER',
    department: '',
    assigned_employee: '',
    maintenance_team: '',
    default_technician: '',
    purchase_date: '',
    warranty_expiry: '',
    location: '',
    notes: '',
    ...initialData
  });

  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeamsAndTechnicians();
  }, []);

  const fetchTeamsAndTechnicians = async () => {
    try {
      const [teamsRes, techRes] = await Promise.all([
        getTeams(),
        getTechnicians()
      ]);
      setTeams(teamsRes.data);
      setTechnicians(techRes.data);
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
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = formData.maintenance_team
    ? technicians.filter(tech => tech.team === parseInt(formData.maintenance_team))
    : technicians;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Equipment Name *</label>
        <input
          type="text"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Serial Number *</label>
        <input
          type="text"
          name="serial_number"
          className="form-input"
          value={formData.serial_number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="category"
          className="form-select"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="MACHINE">Machine</option>
          <option value="VEHICLE">Vehicle</option>
          <option value="COMPUTER">Computer</option>
          <option value="TOOL">Tool</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <input
          type="text"
          name="department"
          className="form-input"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g., Production, IT"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Assigned Employee</label>
        <input
          type="text"
          name="assigned_employee"
          className="form-input"
          value={formData.assigned_employee}
          onChange={handleChange}
          placeholder="Employee name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Maintenance Team</label>
        <select
          name="maintenance_team"
          className="form-select"
          value={formData.maintenance_team}
          onChange={handleChange}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Default Technician</label>
        <select
          name="default_technician"
          className="form-select"
          value={formData.default_technician}
          onChange={handleChange}
        >
          <option value="">Select Technician</option>
          {filteredTechnicians.map(tech => (
            <option key={tech.id} value={tech.id}>
              {tech.user.full_name} - {tech.team_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Purchase Date</label>
        <input
          type="date"
          name="purchase_date"
          className="form-input"
          value={formData.purchase_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Warranty Expiry</label>
        <input
          type="date"
          name="warranty_expiry"
          className="form-input"
          value={formData.warranty_expiry}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input
          type="text"
          name="location"
          className="form-input"
          value={formData.location}
          onChange={handleChange}
          placeholder="Physical location"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional information"
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Equipment'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EquipmentForm;