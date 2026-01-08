import { useState, useEffect } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../services/api';
import { Toast } from '../common/Toast';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6', // Default blue color
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await getTeams();
      setTeams(teamsData);
    } catch (err) {
      setError(err.message || 'Failed to load teams');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      color: '#3B82F6',
    });
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      color: team.color,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async (team) => {
    if (window.confirm(`Are you sure you want to delete "${team.name}"?`)) {
      try {
        await deleteTeam(team.id);
        setToast({ message: 'Team deleted successfully', type: 'success' });
        await fetchTeams();
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to delete team';
        setToast({ message: errorMessage, type: 'error' });
        console.error('Error deleting team:', err);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Team name must be 100 characters or less';
    }

    if (!formData.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      newErrors.color = 'Color must be a valid hex color (e.g., #FF5733)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (editingTeam) {
          await updateTeam(editingTeam.id, formData);
          setToast({ message: 'Team updated successfully', type: 'success' });
        } else {
          await createTeam(formData);
          setToast({ message: 'Team created successfully', type: 'success' });
        }
        setShowForm(false);
        setEditingTeam(null);
        await fetchTeams();
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to save team';
        setToast({ message: errorMessage, type: 'error' });
        console.error('Error saving team:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeam(null);
    setFormData({
      name: '',
      color: '#3B82F6',
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            + Add Team
          </button>
        </div>
      </div>

      {/* Content */}
      {showForm ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingTeam ? 'Edit Team' : 'Add New Team'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter team name"
                  maxLength={100}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="#3B82F6"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
                {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Select a color to identify this team visually
                </p>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div
                  className="px-4 py-3 rounded-md border border-gray-300"
                  style={{ backgroundColor: formData.color + '20', borderColor: formData.color }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {formData.name || 'Team Name'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  {editingTeam ? 'Update' : 'Create'} Team
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          {teams.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg mb-2">No teams found</p>
              <p className="text-sm">Click "Add Team" to create your first team</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: team.color + '40' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: team.color }}
                      />
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>Color:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{team.color}</code>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {team.initiatives?.length || 0} initiative(s) assigned
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded flex-1"
                      disabled={team.initiatives?.length > 0}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

