import React, { useState, useEffect } from 'react';
import { getCalendarRequests } from '../services/api';

function CalendarView({ onDateClick }) {
  const [requests, setRequests] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchCalendarRequests();
  }, []);

  const fetchCalendarRequests = async () => {
    try {
      const response = await getCalendarRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching calendar requests:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getRequestsForDate = (date) => {
    if (!date) return [];
    
    return requests.filter(req => {
      const reqDate = new Date(req.scheduled_date);
      return reqDate.toDateString() === date.toDateString();
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={previousMonth}>
          ← Previous
        </button>
        <h2>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="btn btn-secondary" onClick={nextMonth}>
          Next →
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          const dayRequests = date ? getRequestsForDate(date) : [];
          const hasEvents = dayRequests.length > 0;
          
          return (
            <div
              key={index}
              className={`calendar-day ${hasEvents ? 'has-event' : ''}`}
              onClick={() => date && onDateClick && onDateClick(date)}
              style={{
                opacity: date ? 1 : 0,
                cursor: date ? 'pointer' : 'default'
              }}
            >
              {date && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {date.getDate()}
                  </div>
                  {hasEvents && (
                    <div style={{ fontSize: '11px', color: '#2196f3' }}>
                      {dayRequests.length} request{dayRequests.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;