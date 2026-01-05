import { useState } from 'react';
import { updateInitiative } from '../../services/api';
import { MONTHS_SHORT } from '../../utils/dateUtils';

export const InitiativeDetails = ({ initiative, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    code: initiative?.code || '',
    name: initiative?.name || '',
    description: initiative?.description || '',
    target_kpi: initiative?.target_kpi || '',
    estimated_effort: initiative?.estimated_effort || '',
    priority: initiative?.priority || 'medium',
  });

  if (!initiative) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Select an initiative to view details
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateInitiative(initiative.id, formData);
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
                setFormData({
                  code: initiative.code,
                  name: initiative.name,
                  description: initiative.description || '',
                  target_kpi: initiative.target_kpi || '',
                  estimated_effort: initiative.estimated_effort || '',
                  priority: initiative.priority || 'medium',
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

