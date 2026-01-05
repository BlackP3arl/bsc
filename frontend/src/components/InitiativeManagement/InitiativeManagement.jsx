import { useState, useEffect } from 'react';
import { getInitiatives, getPerspectives, createInitiative, updateInitiative, deleteInitiative } from '../../services/api';
import { InitiativeForm } from './InitiativeForm';
import { Toast } from '../common/Toast';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const InitiativeManagement = ({ onDataChange }) => {
  const [initiatives, setInitiatives] = useState([]);
  const [perspectives, setPerspectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedPerspective, setSelectedPerspective] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [initiativesData, perspectivesData] = await Promise.all([
        getInitiatives(),
        getPerspectives(),
      ]);
      setInitiatives(initiativesData);
      setPerspectives(perspectivesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingInitiative(null);
    setShowForm(true);
  };

  const handleEdit = (initiative) => {
    setEditingInitiative(initiative);
    setShowForm(true);
  };

  const handleDelete = async (initiative) => {
    if (window.confirm(`Are you sure you want to delete "${initiative.code}: ${initiative.name}"?`)) {
      try {
        await deleteInitiative(initiative.id);
        setToast({ message: 'Initiative deleted successfully', type: 'success' });
        await fetchData();
        // Notify parent to refresh Gantt data
        if (onDataChange) {
          onDataChange();
        }
      } catch (err) {
        setToast({ message: 'Failed to delete initiative', type: 'error' });
        console.error('Error deleting initiative:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingInitiative) {
        await updateInitiative(editingInitiative.id, formData);
        setToast({ message: 'Initiative updated successfully', type: 'success' });
      } else {
        await createInitiative(formData);
        setToast({ message: 'Initiative created successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingInitiative(null);
      await fetchData();
      // Notify parent to refresh Gantt data
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to save initiative', type: 'error' });
      console.error('Error saving initiative:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingInitiative(null);
  };

  // Group initiatives by perspective
  const groupedInitiatives = perspectives.reduce((acc, perspective) => {
    acc[perspective.id] = {
      perspective,
      initiatives: initiatives.filter((init) => init.perspective_id === perspective.id),
    };
    return acc;
  }, {});

  // Filter by selected perspective
  const filteredGroups = selectedPerspective === 'all' 
    ? Object.values(groupedInitiatives)
    : [groupedInitiatives[selectedPerspective]].filter(Boolean);

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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Initiative Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            + Add Initiative
          </button>
        </div>

        {/* Perspective Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter by Perspective:</label>
          <select
            value={selectedPerspective}
            onChange={(e) => setSelectedPerspective(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Perspectives</option>
            {perspectives.map((perspective) => (
              <option key={perspective.id} value={perspective.id}>
                {perspective.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {showForm ? (
        <div className="flex-1 overflow-auto p-6">
          <InitiativeForm
            initiative={editingInitiative}
            perspectives={perspectives}
            initiatives={initiatives}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No initiatives found
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.perspective.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Perspective Header */}
                  <div
                    className="px-4 py-3 font-bold text-sm text-white"
                    style={{ backgroundColor: group.perspective.color_header }}
                  >
                    {group.perspective.name} ({group.initiatives.length})
                  </div>

                  {/* Initiatives List */}
                  <div className="divide-y divide-gray-200">
                    {group.initiatives.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No initiatives in this perspective
                      </div>
                    ) : (
                      group.initiatives.map((initiative) => (
                        <div
                          key={initiative.id}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{initiative.code}</span>
                                <span className="text-sm text-gray-600">{initiative.name}</span>
                                {initiative.priority && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      initiative.priority === 'high'
                                        ? 'bg-red-100 text-red-800'
                                        : initiative.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {initiative.priority}
                                  </span>
                                )}
                              </div>
                              {initiative.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {initiative.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                {initiative.target_kpi && (
                                  <span>KPI: {initiative.target_kpi}</span>
                                )}
                                {initiative.estimated_effort && (
                                  <span>Effort: {initiative.estimated_effort}</span>
                                )}
                                {initiative.schedule && (
                                  <span>
                                    Scheduled: {initiative.schedule.start_month + 1}/{initiative.schedule.year} - {initiative.schedule.end_month + 1}/{initiative.schedule.year}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(initiative)}
                                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(initiative)}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

