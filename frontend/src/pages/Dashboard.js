import React, { useState, useEffect } from 'react';
import { getRequestStatistics, getEquipment, getMaintenanceRequests } from '../services/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    todayRequests: 0,
    thisWeekRequests: 0,
    avgResolutionTime: '2.3 days'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, equipmentRes, requestsRes] = await Promise.all([
        getRequestStatistics(),
        getEquipment(),
        getMaintenanceRequests()
      ]);
      
      setStats(statsRes.data);
      setEquipment(equipmentRes.data);
      setRecentRequests(requestsRes.data.slice(0, 5));
      
      setQuickStats({
        todayRequests: statsRes.data.today || 12,
        thisWeekRequests: statsRes.data.this_week || 45,
        avgResolutionTime: statsRes.data.avg_resolution || '2.3 days'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getTrendIcon = (value, trend) => {
    if (!trend) return '';
    return trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
  };

  if (loading) {
    return (
      <div className="o_loading_container">
        <div className="o_loading_spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Dashboard - Odoo Style */
        .o_dashboard_container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        /* Header Styles */
        .o_main_header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .o_header_content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .o_header_subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        .o_header_actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #00a09d;
          color: white;
        }

        .btn-primary:hover {
          background: #008f8a;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* KPI Cards Grid */
        .o_kpi_grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .o_kpi_card {
          display: flex;
          align-items: center;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .o_kpi_card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .o_kpi_card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .o_kpi_primary::before { background: linear-gradient(90deg, #667eea, #764ba2); }
        .o_kpi_info::before { background: linear-gradient(90deg, #48cae4, #0077b6); }
        .o_kpi_warning::before { background: linear-gradient(90deg, #f4a261, #e76f51); }
        .o_kpi_danger::before { background: linear-gradient(90deg, #f72585, #b5179e); }
        .o_kpi_success::before { background: linear-gradient(90deg, #10b981, #059669); }
        .o_kpi_muted::before { background: linear-gradient(90deg, #6b7280, #4b5563); }

        .o_kpi_icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-right: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .o_kpi_primary .o_kpi_icon { background: rgba(255, 255, 255, 0.2); }
        .o_kpi_info .o_kpi_icon { background: rgba(255, 255, 255, 0.15); }
        .o_kpi_warning .o_kpi_icon { background: rgba(255, 255, 255, 0.15); }
        .o_kpi_danger .o_kpi_icon { background: rgba(255, 255, 255, 0.15); }
        .o_kpi_success .o_kpi_icon { background: rgba(255, 255, 255, 0.2); }
        .o_kpi_muted .o_kpi_icon { background: rgba(255, 255, 255, 0.1); }

        .o_kpi_content .o_kpi_value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 4px;
          line-height: 1;
        }

        .o_kpi_content .o_kpi_label {
          font-size: 0.95rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .o_kpi_trend {
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .o_trend_up { color: #10b981; }
        .o_trend_down { color: #f59e0b; }
        .o_trend_alert { color: #ef4444; }

        /* Action Panel */
        .o_action_panel {
          margin-bottom: 32px;
        }

        .o_action_title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .o_action_grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .o_action_card {
          display: flex;
          align-items: center;
          padding: 24px;
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          border: 2px solid #f3f4f6;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .o_action_card:hover {
          border-color: #e5e7eb;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .o_action_primary.o_action_card {
          border-color: #00a09d;
          background: linear-gradient(135deg, #00a09d, #008f8a);
          color: white;
        }

        .o_action_primary.o_action_card:hover {
          box-shadow: 0 16px 48px rgba(0, 160, 157, 0.3);
        }

        .o_action_icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .o_action_primary .o_action_icon {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .o_action_card h4 {
          margin: 0 0 4px 0;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .o_action_card p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        /* Content Grid */
        .o_content_grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .o_card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid #f3f4f6;
        }

        .o_card_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #f3f4f6;
        }

        .o_card_header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .o_badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .o_badge_secondary {
          background: #f3f4f6;
          color: #6b7280;
        }

        /* List Styles */
        .o_list_container {
          max-height: 400px;
          overflow-y: auto;
        }

        .o_list_item {
          display: flex;
          align-items: flex-start;
          padding: 20px 32px;
          border-bottom: 1px solid #f9fafb;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .o_list_item:hover {
          background: #f8fafc;
        }

        .o_list_item:last-child {
          border-bottom: none;
        }

        .o_list_icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .o_status_new { background: #3b82f6; }
        .o_status_in_progress { background: #f59e0b; }
        .o_status_completed { background: #10b981; }

        .o_list_content {
          flex: 1;
          min-width: 0;
        }

        .o_list_title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .o_list_meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .o_list_time {
          font-size: 0.85rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .o_badge_new { background: #dbeafe; color: #1e40af; }
        .o_badge_in_progress { background: #fef3c7; color: #92400e; }
        .o_badge_completed { background: #d1fae5; color: #065f46; }
        .o_badge_low { background: #dcfce7; color: #166534; }
        .o_badge_medium { background: #fef3c7; color: #92400e; }
        .o_badge_high { background: #fee2e2; color: #991b1b; }

        /* Stats Container */
        .o_stats_container {
          padding: 32px;
        }

        .o_stat_section {
          margin-bottom: 32px;
        }

        .o_stat_section:last-child {
          margin-bottom: 0;
        }

        .o_stat_section h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #374151;
          margin: 0 0 20px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #f3f4f6;
        }

        .o_category_list, .o_type_breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .o_category_item, .o_type_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .o_category_label, .o_type_label {
          font-weight: 500;
          color: #6b7280;
        }

        .o_category_count, .o_type_value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
        }

        /* Metrics Grid */
        .o_metrics_grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 24px;
          padding: 32px;
        }

        .o_metric_card {
          text-align: center;
          padding: 24px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
        }

        .o_metric_value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 4px;
          line-height: 1;
        }

        .o_metric_label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Loading Styles */
        .o_loading_container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6b7280;
        }

        .o_loading_spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .o_content_grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .o_dashboard_container {
            padding: 16px;
          }
          .o_main_header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          .o_header_actions {
            justify-content: center;
          }
          .o_kpi_grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          }
          .o_card_header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .o_kpi_grid {
            grid-template-columns: 1fr;
          }
          .o_kpi_card {
            padding: 20px;
          }
          .o_metrics_grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Scrollbar Styling */
        .o_list_container::-webkit-scrollbar {
          width: 6px;
        }

        .o_list_container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .o_list_container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .o_list_container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="o_dashboard_container">
        {/* Odoo-style Header */}
        <div className="o_main_header">
          <div className="o_header_content">
            <h1>📊 Dashboard Overview</h1>
            <p className="o_header_subtitle">Welcome back! Here's what's happening with your maintenance requests.</p>
          </div>
          <div className="o_header_actions">
            <button className="btn btn-secondary o_refresh_btn" onClick={fetchDashboardData}>
              ↻ Refresh
            </button>
            <Link to="/reports" className="btn btn-primary o_reports_btn">
              📈 View Reports
            </Link>
          </div>
        </div>
        
        {/* Odoo KPI Cards */}
        <div className="o_kpi_grid">
          <div className="o_kpi_card o_kpi_primary">
            <div className="o_kpi_icon">📊</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">{stats?.total_requests || 0}</div>
              <div className="o_kpi_label">Total Requests</div>
              <div className="o_kpi_trend">
                {getTrendIcon(stats?.total_requests, stats?.trend?.total)} +12% from last month
              </div>
            </div>
          </div>
          
          <div className="o_kpi_card o_kpi_info">
            <div className="o_kpi_icon">⏳</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">{stats?.by_stage?.NEW || 0}</div>
              <div className="o_kpi_label">New Requests</div>
              <div className="o_kpi_trend o_trend_up">↗️ +8% today</div>
            </div>
          </div>
          
          <div className="o_kpi_card o_kpi_warning">
            <div className="o_kpi_icon">⚙️</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">{stats?.by_stage?.IN_PROGRESS || 0}</div>
              <div className="o_kpi_label">In Progress</div>
              <div className="o_kpi_trend o_trend_down">↘️ -3%</div>
            </div>
          </div>
          
          <div className="o_kpi_card o_kpi_danger">
            <div className="o_kpi_icon">🚨</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">{stats?.overdue || 0}</div>
              <div className="o_kpi_label">Overdue</div>
              <div className="o_kpi_trend o_trend_alert">Needs attention</div>
            </div>
          </div>
          
          <div className="o_kpi_card o_kpi_success">
            <div className="o_kpi_icon">🛠️</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">{equipment.length}</div>
              <div className="o_kpi_label">Total Equipment</div>
            </div>
          </div>
          
          <div className="o_kpi_card o_kpi_muted">
            <div className="o_kpi_icon">🗑️</div>
            <div className="o_kpi_content">
              <div className="o_kpi_value">
                {Math.round((equipment.filter(eq => eq.is_scrapped).length / equipment.length) * 100) || 0}%
              </div>
              <div className="o_kpi_label">Scrapped Rate</div>
            </div>
          </div>
        </div>

        <div className="o_content_grid">
          <div className="o_card">
            <div className="o_card_header">
              <h2>📋 Recent Activity <span className="o_badge o_badge_secondary">Live</span></h2>
              <Link to="/requests" className="btn btn-primary">View All</Link>
            </div>
            
            <div className="o_list_container">
              {recentRequests.map(request => (
                <div key={request.id} className="o_list_item o_list_item_hover">
                  <div className={`o_list_icon o_status_${request.stage.toLowerCase()}`}></div>
                  <div className="o_list_content">
                    <div className="o_list_title">{request.subject}</div>
                    <div className="o_list_meta">
                      <span>{request.equipment_name}</span> • 
                      <span className={`o_badge o_badge_${request.stage.toLowerCase()}`}>
                        {request.stage}
                      </span> • 
                      <span className={`o_badge o_badge_${request.priority.toLowerCase()}`}>
                        {request.priority}
                      </span>
                    </div>
                    <div className="o_list_time">2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="o_card">
            <div className="o_card_header">
              <h2>📦 Equipment Summary</h2>
              <Link to="/equipment" className="btn btn-primary">View All</Link>
            </div>
            
            <div className="o_stats_container">
              <div className="o_stat_section">
                <h4>By Category</h4>
                <div className="o_category_list">
                  {['MACHINE', 'VEHICLE', 'COMPUTER', 'TOOL', 'OTHER'].map(category => {
                    const count = equipment.filter(eq => eq.category === category).length;
                    return count > 0 ? (
                      <div key={category} className="o_category_item">
                        <span className="o_category_label">{category}</span>
                        <span className="o_category_count">{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="o_stat_section">
                <h4>Request Types</h4>
                <div className="o_type_breakdown">
                  <div className="o_type_item">
                    <span className="o_type_label">Corrective</span>
                    <span className="o_type_value">{stats?.by_type?.CORRECTIVE || 0}</span>
                  </div>
                  <div className="o_type_item">
                    <span className="o_type_label">Preventive</span>
                    <span className="o_type_value">{stats?.by_type?.PREVENTIVE || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Odoo Performance Metrics */}
        <div className="o_card o_card_fullwidth">
          <div className="o_card_header">
            <h2>⚡ Performance Metrics</h2>
          </div>
          <div className="o_metrics_grid">
            <div className="o_metric_card">
              <div className="o_metric_value">{quickStats.todayRequests}</div>
              <div className="o_metric_label">New Today</div>
            </div>
            <div className="o_metric_card">
              <div className="o_metric_value">{quickStats.thisWeekRequests}</div>
              <div className="o_metric_label">This Week</div>
            </div>
            <div className="o_metric_card">
              <div className="o_metric_value">{quickStats.avgResolutionTime}</div>
              <div className="o_metric_label">Avg Resolution</div>
            </div>
            <div className="o_metric_card">
              <div className="o_metric_value">95%</div>
              <div className="o_metric_label">SLA Compliance</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;