import React, { useState, useEffect } from 'react';
import { getMaintenanceRequests, updateRequestStage } from '../services/api';

function KanbanBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);

  const stages = [
    { key: 'NEW', label: 'New', color: '#3498db' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: '#f39c12' },
    { key: 'REPAIRED', label: 'Repaired', color: '#27ae60' },
    { key: 'SCRAP', label: 'Scrap', color: '#e74c3c' }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMaintenanceRequests();
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (e, request) => {
    setDraggedItem(request);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.stage !== newStage) {
      try {
        await updateRequestStage(draggedItem.id, newStage);
        fetchRequests();
      } catch (error) {
        console.error('Error updating stage:', error);
        alert('Failed to update request stage');
      }
    }
    
    setDraggedItem(null);
  };

  const getRequestsByStage = (stage) => {
    return requests.filter(req => req.stage === stage);
  };

  const getBadgeClass = (priority) => {
    const classes = {
      'LOW': 'badge-secondary',
      'MEDIUM': 'badge-new',
      'HIGH': 'badge-warning',
      'URGENT': 'badge-scrap'
    };
    return classes[priority] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="kanban-board">
      {stages.map(stage => (
        <div
          key={stage.key}
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.key)}
        >
          <div className="kanban-header" style={{ borderColor: stage.color }}>
            <span>{stage.label}</span>
            <span className="badge" style={{ backgroundColor: stage.color }}>
              {getRequestsByStage(stage.key).length}
            </span>
          </div>
          
          <div className="kanban-cards">
            {getRequestsByStage(stage.key).map(request => (
              <div
                key={request.id}
                className={`kanban-card ${draggedItem?.id === request.id ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, request)}
              >
                <h4>{request.subject}</h4>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                  {request.equipment_name}
                </p>
                
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <span className={`badge ${getBadgeClass(request.priority)}`}>
                    {request.priority}
                  </span>
                  <span className="badge" style={{ backgroundColor: '#95a5a6' }}>
                    {request.request_type}
                  </span>
                  {request.is_overdue && (
                    <span className="badge badge-overdue">OVERDUE</span>
                  )}
                </div>
                
                {request.assigned_technician_name && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
                    👤 {request.assigned_technician_name}
                  </div>
                )}
                
                {request.scheduled_date && (
                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                    📅 {new Date(request.scheduled_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;