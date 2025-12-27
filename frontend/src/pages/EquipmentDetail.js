import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, updateEquipment, getEquipmentRequests } from '../services/api';
import Modal from '../components/Modal';
import EquipmentForm from '../components/EquipmentForm';

function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchEquipmentDetails();
  }, [id]);

  const fetchEquipmentDetails = async () => {
    try {
      const [equipmentRes, requestsRes] = await Promise.all([
        getEquipmentById(id),
        getEquipmentRequests(id)
      ]);
      setEquipment(equipmentRes.data);
      setRequests(requestsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment details:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateEquipment(id, formData);
      setShowEditModal(false);
      fetchEquipmentDetails();
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="loading">Loading equipment details...</div>;
  }

  if (!equipment) {
    return <div className="error">Equipment not found</div>;
  }

  const openRequests = requests.filter(req => !['REPAIRED', 'SCRAP'].includes(req.stage));

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate('/equipment')} style={{ marginBottom: '20px' }}>
        ← Back to Equipment List
      </button>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2>{equipment.name}</h2>
            <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
              Edit
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Serial Number:</strong> {equipment.serial_number}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Category:</strong> <span className="badge">{equipment.category}</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Department:</strong> {equipment.department || 'Not assigned'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Assigned Employee:</strong> {equipment.assigned_employee || 'Not assigned'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Maintenance Team:</strong> {equipment.maintenance_team_name || 'Not assigned'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Default Technician:</strong> {equipment.default_technician_name || 'Not assigned'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Location:</strong> {equipment.location || 'Not specified'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Purchase Date:</strong> {equipment.purchase_date || 'Not specified'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Warranty Expiry:</strong> {equipment.warranty_expiry || 'Not specified'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong>{' '}
              {equipment.is_scrapped ? (
                <span className="badge badge-scrap">Scrapped</span>
              ) : (
                <span className="badge badge-repaired">Active</span>
              )}
            </div>
            {equipment.notes && (
              <div style={{ marginTop: '20px' }}>
                <strong>Notes:</strong>
                <p style={{ marginTop: '5px', color: '#666' }}>{equipment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Maintenance Requests</h2>
            <div>
              <span className="badge badge-new" style={{ marginRight: '10px' }}>
                {openRequests.length} Open
              </span>
              <span className="badge badge-secondary">
                {requests.length} Total
              </span>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {requests.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>No maintenance requests yet</p>
            ) : (
              <div>
                {requests.map(request => (
                  <div
                    key={request.id}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>{request.subject}</strong>
                      <span className={`badge badge-${request.stage.toLowerCase()}`}>
                        {request.stage}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      Type: {request.request_type} | Priority: {request.priority}
                    </div>
                    {request.assigned_technician_name && (
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>
                        Assigned to: {request.assigned_technician_name}
                      </div>
                    )}
                    {request.scheduled_date && (
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                        Scheduled: {new Date(request.scheduled_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Equipment"
      >
        <EquipmentForm
          initialData={equipment}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
}

export default EquipmentDetail;