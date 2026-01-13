import { useState, useEffect } from 'react';
import { updateInitiative, getTeams } from '../../services/api';
import { MONTHS_SHORT } from '../../utils/dateUtils';

export const InitiativeDetails = ({ initiative, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    code: initiative?.code || '',
    name: initiative?.name || '',
    description: initiative?.description || '',
    target_kpi: initiative?.target_kpi || '',
    estimated_effort: initiative?.estimated_effort || '',
    priority: initiative?.priority || 'medium',
    team_ids: [],
  });

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // Update formData when initiative changes
  useEffect(() => {
    if (initiative) {
      // Handle both old format (team_id) and new format (teams array)
      const teamIds = initiative.teams 
        ? initiative.teams.map((team) => team.id)
        : initiative.team_id 
        ? [initiative.team_id]
        : [];
      
      setFormData({
        code: initiative.code || '',
        name: initiative.name || '',
        description: initiative.description || '',
        target_kpi: initiative.target_kpi || '',
        estimated_effort: initiative.estimated_effort || '',
        priority: initiative.priority || 'medium',
        team_ids: teamIds,
      });
    }
  }, [initiative]);

  if (!initiative) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Select an initiative to view details
      </div>
    );
  }

  const handleSave = async () => {
    try {
      // Ensure team_ids is an array
      const updateData = {
        ...formData,
        team_ids: Array.isArray(formData.team_ids) ? formData.team_ids : [],
      };
      await updateInitiative(initiative.id, updateData);
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update initiative:', error);
      alert('Failed to update initiative');
    }
  };

  const schedule = initiative.schedule;
  const perspective = initiative.perspective;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Initiative Details</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target KPI
            </label>
            <input
              type="text"
              value={formData.target_kpi}
              onChange={(e) => setFormData({ ...formData, target_kpi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Effort
            </label>
            <input
              type="text"
              value={formData.estimated_effort}
              onChange={(e) => setFormData({ ...formData, estimated_effort: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teams
            </label>
            <div className="border border-gray-300 rounded-md min-h-[42px] px-3 py-2">
              {teams.length === 0 ? (
                <span className="text-sm text-gray-500">No teams available</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => {
                    const isSelected = formData.team_ids.includes(team.id);
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => {
                          const newTeamIds = isSelected
                            ? formData.team_ids.filter((id) => id !== team.id)
                            : [...formData.team_ids, team.id];
                          setFormData({ ...formData, team_ids: newTeamIds });
                        }}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team.color }}
                        />
                        <span>{team.name}</span>
                        {isSelected && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {formData.team_ids.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {formData.team_ids.length} team{formData.team_ids.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                // Reset formData to original initiative values
                const teamIds = initiative.teams 
                  ? initiative.teams.map((team) => team.id)
                  : initiative.team_id 
                  ? [initiative.team_id]
                  : [];
                setFormData({
                  code: initiative.code,
                  name: initiative.name,
                  description: initiative.description || '',
                  target_kpi: initiative.target_kpi || '',
                  estimated_effort: initiative.estimated_effort || '',
                  priority: initiative.priority || 'medium',
                  team_ids: teamIds,
                });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <p className="text-sm text-gray-900">{initiative.code}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <p className="text-sm text-gray-900">{initiative.name}</p>
          </div>
          {initiative.description && (
            <div>
              <span className="text-sm font-medium text-gray-500">Description:</span>
              <p className="text-sm text-gray-900">{initiative.description}</p>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-500">Perspective:</span>
            <p className="text-sm text-gray-900">{perspective?.name}</p>
          </div>
          {initiative.target_kpi && (
            <div>
              <span className="text-sm font-medium text-gray-500">Target KPI:</span>
              <p className="text-sm text-gray-900">{initiative.target_kpi}</p>
            </div>
          )}
          {initiative.estimated_effort && (
            <div>
              <span className="text-sm font-medium text-gray-500">Estimated Effort:</span>
              <p className="text-sm text-gray-900">{initiative.estimated_effort}</p>
            </div>
          )}
          {initiative.priority && (
            <div>
              <span className="text-sm font-medium text-gray-500">Priority:</span>
              <p className="text-sm text-gray-900 capitalize">{initiative.priority}</p>
            </div>
          )}
          {(() => {
            // Handle both old format (team) and new format (teams array)
            const initiativeTeams = initiative.teams 
              ? initiative.teams 
              : initiative.team 
              ? [initiative.team]
              : [];
            
            return initiativeTeams.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Teams:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {initiativeTeams.map((team) => (
                    <span
                      key={team.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      {team.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
          {schedule && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-500">Schedule:</span>
              <p className="text-sm text-gray-900">
                {MONTHS_SHORT[schedule.start_month]}. {schedule.year} - {MONTHS_SHORT[schedule.end_month]}. {schedule.year}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

