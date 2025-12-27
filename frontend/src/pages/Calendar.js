import React, { useState } from 'react';
import CalendarView from '../components/CalendarView';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRequests, setDateRequests] = useState([]);

  // 📌 Dummy maintenance data (expanded)
  const sampleRequests = [
    {
      id: 1,
      subject: "AC Preventive Check",
      stage: "Open",
      equipment_name: "Packaged AC Unit",
      request_type: "Preventive",
      priority: "High",
      scheduled_date: "2025-01-27T10:00:00",
      assigned_technician_name: "Rahul Sharma"
    },
    {
      id: 2,
      subject: "Oil Leakage Fix",
      stage: "In Progress",
      equipment_name: "Hydraulic Press",
      request_type: "Corrective",
      priority: "Medium",
      scheduled_date: "2025-01-27T14:30:00",
      assigned_technician_name: "Amit Verma"
    },
    {
      id: 3,
      subject: "Fire Pump Inspection",
      stage: "Done",
      equipment_name: "Fire Pump",
      request_type: "Inspection",
      priority: "Low",
      scheduled_date: "2025-01-28T09:00:00",
      assigned_technician_name: "Neha Patel"
    },
    {
      id: 4,
      subject: "Boiler Pressure Check",
      stage: "Open",
      equipment_name: "Steam Boiler",
      request_type: "Preventive",
      priority: "High",
      scheduled_date: "2025-01-28T11:15:00",
      assigned_technician_name: "Manish Kumar"
    },
    {
      id: 5,
      subject: "Lift Door Alignment",
      stage: "In Progress",
      equipment_name: "Passenger Lift",
      request_type: "Corrective",
      priority: "High",
      scheduled_date: "2025-01-29T13:00:00",
      assigned_technician_name: "Vikas Singh"
    },
    {
      id: 6,
      subject: "Generator Battery Replacement",
      stage: "Open",
      equipment_name: "DG Set 250kVA",
      request_type: "Replacement",
      priority: "Medium",
      scheduled_date: "2025-01-29T16:30:00",
      assigned_technician_name: "Ashok Yadav"
    },
    {
      id: 7,
      subject: "Water Pump Vibration Issue",
      stage: "Open",
      equipment_name: "Centrifugal Pump",
      request_type: "Breakdown",
      priority: "High",
      scheduled_date: "2025-01-30T10:45:00",
      assigned_technician_name: "Rohit Mehta"
    },
    {
      id: 8,
      subject: "Chiller Plant Cleaning",
      stage: "Done",
      equipment_name: "Chiller Unit 2",
      request_type: "Preventive",
      priority: "Low",
      scheduled_date: "2025-01-30T15:20:00",
      assigned_technician_name: "Sunil Jadhav"
    },
    {
      id: 9,
      subject: "Smoke Detector Testing",
      stage: "In Progress",
      equipment_name: "Fire Alarm System",
      request_type: "Inspection",
      priority: "Medium",
      scheduled_date: "2025-01-31T09:30:00",
      assigned_technician_name: "Ritika Shah"
    },
    {
      id: 10,
      subject: "Server Room Cooling Issue",
      stage: "Open",
      equipment_name: "Precision AC",
      request_type: "Breakdown",
      priority: "High",
      scheduled_date: "2025-01-31T12:00:00",
      assigned_technician_name: "Karan Patel"
    },
    {
      id: 11,
      subject: "Lighting Panel Loose Wiring",
      stage: "Done",
      equipment_name: "Lighting Control Panel",
      request_type: "Corrective",
      priority: "Low",
      scheduled_date: "2025-02-01T10:15:00",
      assigned_technician_name: "Pooja Nair"
    },
    {
      id: 12,
      subject: "AHU Filter Replacement",
      stage: "Open",
      equipment_name: "AHU-3",
      request_type: "Preventive",
      priority: "Medium",
      scheduled_date: "2025-02-01T14:00:00",
      assigned_technician_name: "Ramesh Gupta"
    }
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const filtered = sampleRequests.filter(req => {
      const reqDate = new Date(req.scheduled_date);
      return reqDate.toDateString() === date.toDateString();
    });

    setDateRequests(filtered);
  };

  return (
    <div className="container">
      <h1>Maintenance Calendar</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        View and manage preventive maintenance schedules
      </p>

      <div className="grid grid-2">
        <div>
          <CalendarView onDateClick={handleDateClick} />
        </div>

        <div className="card">
          <h2>
            {selectedDate
              ? `Requests for ${selectedDate.toLocaleDateString()}`
              : 'Select a date to view requests'}
          </h2>

          <div style={{ marginTop: '20px' }}>
            {selectedDate && dateRequests.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666' }}>
                No maintenance requests scheduled for this date
              </p>
            )}

            {dateRequests.map(request => (
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

                <div style={{ fontSize: '13px', color: '#666' }}>
                  Equipment: {request.equipment_name}
                </div>

                <div style={{ fontSize: '13px', color: '#666' }}>
                  Type: {request.request_type} | Priority: {request.priority}
                </div>

                {request.assigned_technician_name && (
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>
                    Assigned to: {request.assigned_technician_name}
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                  Time: {new Date(request.scheduled_date).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;