import React, { useState, useEffect } from 'react';
import { getTeams, createTeam, getTechnicians, createTechnician, getUsers } from '../services/api';
import Modal from '../components/Modal';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalTechnicians: 0,
    availableUsers: 0,
    avgTeamSize: 0
  });

  const [teamForm, setTeamForm] = useState({ name: '', description: '' });
  const [techForm, setTechForm] = useState({
    user_id: '',
    team: '',
    phone: '',
    specialization: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, techRes, usersRes] = await Promise.all([
        getTeams(),
        getTechnicians(),
        getUsers()
      ]);
      const teamsData = teamsRes.data;
      const techData = techRes.data;
      const usersData = usersRes.data;
      
      setTeams(teamsData);
      setTechnicians(techData);
      setUsers(usersData);

      // Calculate stats
      const totalTeams = teamsData.length;
      const totalTechnicians = techData.length;
      const availableUsers = usersData.filter(u => !techData.some(t => t.user_id === u.id)).length;
      const avgTeamSize = totalTeams > 0 ? Math.round(totalTechnicians / totalTeams) : 0;

      setStats({ totalTeams, totalTechnicians, availableUsers, avgTeamSize });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(teamForm);
      setShowTeamModal(false);
      setTeamForm({ name: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleCreateTechnician = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...techForm,
        user_id: parseInt(techForm.user_id),
        team: parseInt(techForm.team)
      };
      await createTechnician(submitData);
      setShowTechModal(false);
      setTechForm({ user_id: '', team: '', phone: '', specialization: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating technician:', error);
      alert('Failed to create technician');
    }
  };

  if (loading) {
    return (
      <div className="o_loading_container">
        <div className="o_loading_spinner"></div>
        <p>Loading teams & technicians...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Teams & Technicians - Odoo Style */
        .o_teams_container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Main Header */
        .o_main_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 24px 32px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        }

        .o_header_content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .o_header_content p {
          margin: 0;
          opacity: 0.95;
          font-size: 1.1rem;
        }

        .btn {
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
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

        /* Stats Grid */
        .o_stats_grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .o_stat_card {
          display: flex;
          align-items: center;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .o_stat_card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .o_stat_primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .o_stat_success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .o_stat_warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .o_stat_info { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }

        .o_stat_icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-right: 20px;
          flex-shrink: 0;
        }

        .o_stat_value {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }

        .o_stat_label {
          font-size: 0.95rem;
          font-weight: 500;
          opacity: 0.95;
        }

        /* Content Grid */
        .o_content_grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          background: #fafbfc;
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

        .o_card_content {
          padding: 32px;
        }

        /* Team/Tech Cards */
        .o_team_card, .o_tech_card {
          padding: 20px;
          margin-bottom: 16px;
          border: 2px solid #f3f4f6;
          border-radius: 12px;
          background: #fafbfc;
          transition: all 0.3s ease;
        }

        .o_team_card:hover, .o_tech_card:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .o_team_header, .o_tech_header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .o_team_name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
        }

        .o_tech_name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .o_badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .o_badge_success {
          background: #d1fae5;
          color: #065f46;
        }

        .o_team_meta, .o_tech_meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .o_meta_item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .o_meta_label {
          font-weight: 500;
          min-width: 100px;
        }

        /* Empty State */
        .o_empty_state {
          text-align: center;
          padding: 60px 40px;
          color: #6b7280;
        }

        .o_empty_icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .o_empty_state h3 {
          color: #374151;
          margin-bottom: 12px;
          font-size: 1.3rem;
        }

        /* Form Styles */
        .o_form_group {
          margin-bottom: 24px;
        }

        .o_form_label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .o_form_input, .o_form_select, .o_form_textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
          box-sizing: border-box;
        }

        .o_form_textarea {
          min-height: 100px;
          resize: vertical;
        }

        .o_form_input:focus, .o_form_select:focus, .o_form_textarea:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .o_form_actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        /* Loading */
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
          border-top: 4px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .o_content_grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .o_teams_container {
            padding: 16px;
          }
          .o_main_header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          .o_stats_grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          .o_form_actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .o_stats_grid {
            grid-template-columns: 1fr;
          }
          .o_team_header, .o_tech_header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="o_teams_container">
        {/* Main Header */}
        <div className="o_main_header">
          <div className="o_header_content">
            <h1>👥 Teams & Technicians</h1>
            <p>Manage your maintenance teams - {stats.totalTeams} teams, {stats.totalTechnicians} technicians</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => setShowTeamModal(true)}>
              ➕ Add Team
            </button>
            <button className="btn btn-secondary" onClick={() => setShowTechModal(true)}>
              👷 Add Technician
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="o_stats_grid">
          <div className="o_stat_card o_stat_primary">
            <div className="o_stat_icon">🏢</div>
            <div>
              <div className="o_stat_value">{stats.totalTeams}</div>
              <div className="o_stat_label">Total Teams</div>
            </div>
          </div>
          <div className="o_stat_card o_stat_success">
            <div className="o_stat_icon">👷</div>
            <div>
              <div className="o_stat_value">{stats.totalTechnicians}</div>
              <div className="o_stat_label">Technicians</div>
            </div>
          </div>
          <div className="o_stat_card o_stat_warning">
            <div className="o_stat_icon">👤</div>
            <div>
              <div className="o_stat_value">{stats.availableUsers}</div>
              <div className="o_stat_label">Available Users</div>
            </div>
          </div>
          <div className="o_stat_card o_stat_info">
            <div className="o_stat_icon">📊</div>
            <div>
              <div className="o_stat_value">{stats.avgTeamSize}</div>
              <div className="o_stat_label">Avg Team Size</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="o_content_grid">
          {/* Teams Section */}
          <div className="o_card">
            <div className="o_card_header">
              <h2>🏢 Maintenance Teams</h2>
            </div>
            <div className="o_card_content">
              {teams.map(team => (
                <div key={team.id} className="o_team_card">
                  <div className="o_team_header">
                    <div className="o_team_name">{team.name}</div>
                    <span className="o_badge o_badge_success">
                      {team.technician_count} members
                    </span>
                  </div>
                  {team.description && (
                    <p style={{ color: '#6b7280', margin: '12px 0 16px 0', lineHeight: 1.5 }}>
                      {team.description}
                    </p>
                  )}
                  <div className="o_team_meta">
                    <div className="o_meta_item">
                      <span className="o_meta_label">ID:</span>
                      <span>#{team.id}</span>
                    </div>
                    <div className="o_meta_item">
                      <span className="o_meta_label">Created:</span>
                      <span>{team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="o_empty_state">
                  <div className="o_empty_icon">🏢</div>
                  <h3>No teams created</h3>
                  <p>Create your first maintenance team to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Technicians Section */}
          <div className="o_card">
            <div className="o_card_header">
              <h2>👷 Technicians</h2>
            </div>
            <div className="o_card_content">
              {technicians.map(tech => (
                <div key={tech.id} className="o_tech_card">
                  <div className="o_tech_header">
                    <div className="o_tech_name">{tech.user?.full_name || 'N/A'}</div>
                    <span className="o_badge o_badge_success">
                      {tech.team_name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="o_tech_meta">
                    {tech.specialization && (
                      <div className="o_meta_item">
                        <span className="o_meta_label">Specialty:</span>
                        <span>{tech.specialization}</span>
                      </div>
                    )}
                    {tech.phone && (
                      <div className="o_meta_item">
                        <span className="o_meta_label">Phone:</span>
                        <span>{tech.phone}</span>
                      </div>
                    )}
                    <div className="o_meta_item">
                      <span className="o_meta_label">ID:</span>
                      <span>#{tech.id}</span>
                    </div>
                  </div>
                </div>
              ))}
              {technicians.length === 0 && (
                <div className="o_empty_state">
                  <div className="o_empty_icon">👷</div>
                  <h3>No technicians added</h3>
                  <p>Add technicians to your teams to manage maintenance requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Creation Modal */}
        <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title="➕ Create Maintenance Team">
          <form onSubmit={handleCreateTeam}>
            <div className="o_form_group">
              <label className="o_form_label">Team Name *</label>
              <input
                type="text"
                className="o_form_input"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                required
                placeholder="e.g., Mechanics, IT Support, HVAC"
              />
            </div>
            <div className="o_form_group">
              <label className="o_form_label">Description</label>
              <textarea
                className="o_form_textarea"
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                placeholder="Team responsibilities, coverage area, etc."
              />
            </div>
            <div className="o_form_actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowTeamModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Team
              </button>
            </div>
          </form>
        </Modal>

        {/* Technician Creation Modal */}
        <Modal isOpen={showTechModal} onClose={() => setShowTechModal(false)} title="👷 Add Technician">
          <form onSubmit={handleCreateTechnician}>
            <div className="o_form_group">
              <label className="o_form_label">User *</label>
              <select
                className="o_form_select"
                value={techForm.user_id}
                onChange={(e) => setTechForm({ ...techForm, user_id: e.target.value })}
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="o_form_group">
              <label className="o_form_label">Team *</label>
              <select
                className="o_form_select"
                value={techForm.team}
                onChange={(e) => setTechForm({ ...techForm, team: e.target.value })}
                required
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.technician_count} members)
                  </option>
                ))}
              </select>
            </div>
            <div className="o_form_group">
              <label className="o_form_label">Phone</label>
              <input
                type="text"
                className="o_form_input"
                value={techForm.phone}
                onChange={(e) => setTechForm({ ...techForm, phone: e.target.value })}
                placeholder="Contact number"
              />
            </div>
            <div className="o_form_group">
              <label className="o_form_label">Specialization</label>
              <input
                type="text"
                className="o_form_input"
                value={techForm.specialization}
                onChange={(e) => setTechForm({ ...techForm, specialization: e.target.value })}
                placeholder="e.g., HVAC, Electrical, Plumbing"
              />
            </div>
            <div className="o_form_actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowTechModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Technician
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Teams;