import { useState } from 'react';
import { GanttChart } from './components/GanttChart/GanttChart';
import { InitiativeDetails } from './components/Sidebar/InitiativeDetails';
import { InitiativeManagement } from './components/InitiativeManagement/InitiativeManagement';
import { ExportModal } from './components/Modals/ExportModal';
import { useGanttData } from './hooks/useGanttData';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';

function App() {
  const { data, loading, error, refetch } = useGanttData();
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentView, setCurrentView] = useState('gantt'); // 'gantt' or 'management'

  const handleInitiativeClick = (initiative) => {
    setSelectedInitiative(initiative);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">ICT Scorecard Gantt Chart</h1>
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('gantt')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'gantt'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gantt Chart
            </button>
            <button
              onClick={() => setCurrentView('management')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'management'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Initiatives
            </button>
          </div>
          {currentView === 'gantt' && (
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Export
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      {currentView === 'gantt' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {!sidebarCollapsed && (
            <div className="w-[300px] bg-white border-r border-gray-300 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <InitiativeDetails
                  initiative={selectedInitiative}
                  onUpdate={refetch}
                />
              </div>
            </div>
          )}

          {/* Collapse/Expand button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-gray-600"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>

          {/* Gantt Chart */}
          <div className="flex-1 overflow-hidden">
            <GanttChart
              data={data}
              onInitiativeClick={handleInitiativeClick}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <InitiativeManagement onDataChange={refetch} />
        </div>
      )}

      {/* Export Modal */}
      {currentView === 'gantt' && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default App;

