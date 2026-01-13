import { useState, useEffect, useRef } from 'react';
import { getInitiatives, getPerspectives, getTeams, createInitiative, updateInitiative, deleteInitiative } from '../../services/api';
import { InitiativeForm } from './InitiativeForm';
import { TeamManagement } from '../TeamManagement/TeamManagement';
import { Toast } from '../common/Toast';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TeamFilter } from '../common/TeamFilter';

export const InitiativeManagement = ({ onDataChange }) => {
  const [initiatives, setInitiatives] = useState([]);
  const [perspectives, setPerspectives] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedPerspective, setSelectedPerspective] = useState('all');
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [currentView, setCurrentView] = useState('initiatives'); // 'initiatives' or 'teams'
  const [openTeamDropdown, setOpenTeamDropdown] = useState(null); // Track which initiative's dropdown is open
  const scrollContainerRef = useRef(null); // Ref to track scroll position

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openTeamDropdown && !event.target.closest('.team-dropdown-container')) {
        setOpenTeamDropdown(null);
      }
    };

    if (openTeamDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openTeamDropdown]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [initiativesData, perspectivesData, teamsData] = await Promise.all([
        getInitiatives(),
        getPerspectives(),
        getTeams(),
      ]);
      setInitiatives(initiativesData);
      setPerspectives(perspectivesData);
      setTeams(teamsData);
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

  const handleAssignTeam = async (initiativeId, teamId, isAdding) => {
    try {
      // Save scroll position before update
      const scrollContainer = scrollContainerRef.current;
      const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;

      // Get current initiative data
      const initiative = initiatives.find((init) => init.id === initiativeId);
      if (!initiative) return;

      // Get current team IDs (handle both old and new format)
      const currentTeamIds = initiative.teams 
        ? initiative.teams.map((team) => team.id)
        : initiative.team_id 
        ? [initiative.team_id]
        : [];

      // Update team IDs
      const newTeamIds = isAdding
        ? [...currentTeamIds, teamId].filter((id, index, arr) => arr.indexOf(id) === index) // Add and deduplicate
        : currentTeamIds.filter((id) => id !== teamId); // Remove

      // Prepare update data
      const updateData = {
        code: initiative.code,
        name: initiative.name,
        description: initiative.description,
        perspective_id: initiative.perspective_id,
        team_ids: newTeamIds,
        target_kpi: initiative.target_kpi,
        estimated_effort: initiative.estimated_effort,
        priority: initiative.priority,
        display_order: initiative.display_order,
      };

      await updateInitiative(initiativeId, updateData);
      setToast({ message: isAdding ? 'Team added successfully' : 'Team removed successfully', type: 'success' });
      setOpenTeamDropdown(null);
      
      // Optimistically update local state to avoid full refetch
      setInitiatives((prevInitiatives) =>
        prevInitiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                teams: newTeamIds.map((tid) => teams.find((t) => t.id === tid)).filter(Boolean),
              }
            : init
        )
      );

      // Restore scroll position after state update
      // Use double requestAnimationFrame to ensure DOM has updated
      if (scrollContainer) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = scrollPosition;
            }
          });
        });
      }

      // Notify parent to refresh Gantt data
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to update teams', type: 'error' });
      console.error('Error updating teams:', err);
      // On error, refetch to ensure consistency
      await fetchData();
    }
  };

  // Helper function to check if initiative has any of the selected teams
  const hasSelectedTeams = (initiative) => {
    if (selectedTeamIds.length === 0) return true; // No filter selected, show all
    
    // Handle both old format (team) and new format (teams array)
    const initiativeTeams = initiative.teams 
      ? initiative.teams 
      : initiative.team 
      ? [initiative.team]
      : [];
    
    const initiativeTeamIds = initiativeTeams.map((team) => team.id);
    return selectedTeamIds.some((teamId) => initiativeTeamIds.includes(teamId));
  };

  // Group initiatives by perspective and filter by teams
  const groupedInitiatives = perspectives.reduce((acc, perspective) => {
    const perspectiveInitiatives = initiatives.filter(
      (init) => init.perspective_id === perspective.id && hasSelectedTeams(init)
    );
    acc[perspective.id] = {
      perspective,
      initiatives: perspectiveInitiatives,
    };
    return acc;
  }, {});

  // Filter by selected perspective
  const filteredGroups = selectedPerspective === 'all' 
    ? Object.values(groupedInitiatives)
    : [groupedInitiatives[selectedPerspective]].filter(Boolean);

  // Toggle team filter
  const handleToggleTeam = (teamId) => {
    setSelectedTeamIds((prev) => 
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Initiative Management</h1>
          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('initiatives')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentView === 'initiatives'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Initiatives
              </button>
              <button
                onClick={() => setCurrentView('teams')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentView === 'teams'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Teams
              </button>
            </div>
            {currentView === 'initiatives' && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                + Add Initiative
              </button>
            )}
          </div>
        </div>

        {/* Filters - Only show for initiatives view */}
        {currentView === 'initiatives' && (
          <div className="space-y-3">
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
            <TeamFilter
              teams={teams}
              selectedTeamIds={selectedTeamIds}
              onToggleTeam={handleToggleTeam}
            />
          </div>
        )}
      </div>

      {/* Content */}
      {currentView === 'teams' ? (
        <div className="flex-1 overflow-hidden">
          <TeamManagement />
        </div>
      ) : showForm ? (
        <div className="flex-1 overflow-auto p-6">
          <InitiativeForm
            initiative={editingInitiative}
            perspectives={perspectives}
            initiatives={initiatives}
            teams={teams}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6" ref={scrollContainerRef}>
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
                                {/* Team Assignment */}
                                <div className="relative team-dropdown-container">
                                  {(() => {
                                    // Handle both old format (team) and new format (teams array)
                                    const initiativeTeams = initiative.teams 
                                      ? initiative.teams 
                                      : initiative.team 
                                      ? [initiative.team]
                                      : [];
                                    
                                    return initiativeTeams.length > 0 ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenTeamDropdown(openTeamDropdown === initiative.id ? null : initiative.id);
                                        }}
                                        className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                                        title="Change teams"
                                      >
                                        <div className="flex items-center gap-1">
                                          {initiativeTeams.map((team) => (
                                            <div
                                              key={team.id}
                                              className="w-3 h-3 rounded-full"
                                              style={{ backgroundColor: team.color }}
                                              title={team.name}
                                            />
                                          ))}
                                        </div>
                                        <span>
                                          {initiativeTeams.length === 1 
                                            ? `Team: ${initiativeTeams[0].name}`
                                            : `${initiativeTeams.length} teams`}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenTeamDropdown(openTeamDropdown === initiative.id ? null : initiative.id);
                                        }}
                                        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                                        title="Assign team"
                                      >
                                        <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                                          <span className="text-gray-400 group-hover:text-blue-500 text-xs leading-none">+</span>
                                        </div>
                                        <span className="text-gray-500">Assign team</span>
                                      </button>
                                    );
                                  })()}
                                  
                                  {/* Dropdown */}
                                  {openTeamDropdown === initiative.id && (() => {
                                    // Handle both old format (team) and new format (teams array)
                                    const initiativeTeams = initiative.teams 
                                      ? initiative.teams 
                                      : initiative.team 
                                      ? [initiative.team]
                                      : [];
                                    const currentTeamIds = initiativeTeams.map((t) => t.id);
                                    
                                    return (
                                      <div className="absolute left-0 top-6 z-50 bg-white border border-gray-300 rounded-md shadow-lg min-w-[200px] max-h-[300px] overflow-y-auto">
                                        <div className="py-1">
                                          {teams.map((team) => {
                                            const isSelected = currentTeamIds.includes(team.id);
                                            return (
                                              <button
                                                key={team.id}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAssignTeam(initiative.id, team.id, !isSelected);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                                                  isSelected ? 'bg-blue-50' : ''
                                                }`}
                                              >
                                                <div
                                                  className="w-3 h-3 rounded-full"
                                                  style={{ backgroundColor: team.color }}
                                                />
                                                <span className="flex-1">{team.name}</span>
                                                {isSelected && (
                                                  <span className="text-blue-600">✓</span>
                                                )}
                                              </button>
                                            );
                                          })}
                                          {teams.length === 0 && (
                                            <div className="px-3 py-2 text-sm text-gray-500">
                                              No teams available
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                                
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

