import { GanttBar } from './GanttBar';

const CELL_WIDTH = 80;
const ROW_HEIGHT = 40;
const INITIATIVE_COLUMN_WIDTH = 250;

export const GanttRow = ({
  initiative,
  perspective,
  onInitiativeClick,
  onBarMouseDown,
  onBarDoubleClick,
  onGridMouseDown,
  isDragging = false,
  draggingId = null,
}) => {
  const schedule = initiative.schedule;
  const isRowDragging = isDragging && draggingId === initiative.id;

  return (
    <div
      className={`flex border-b border-gray-200 hover:bg-gray-50 relative z-0 ${
        isRowDragging ? 'bg-blue-50' : ''
      }`}
      style={{ height: `${ROW_HEIGHT}px`, width: '100%' }}
    >
      {/* Initiative name column - sticky */}
      <div
        className="sticky left-0 z-10 bg-white border-r border-gray-300 px-4 py-2 flex items-center min-w-[250px] cursor-pointer hover:bg-gray-100"
        onClick={() => onInitiativeClick(initiative)}
      >
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {initiative.code}
            </span>
            {(() => {
              // Handle both old format (team) and new format (teams array)
              const initiativeTeams = initiative.teams 
                ? initiative.teams 
                : initiative.team 
                ? [initiative.team]
                : [];
              
              return initiativeTeams.length > 0 && (
                <div className="flex items-center gap-1">
                  {initiativeTeams.map((team) => (
                    <div
                      key={team.id}
                      className="w-[9px] h-[9px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                      title={`Team: ${team.name}`}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
          <span className="text-xs text-gray-600 truncate">
            {initiative.name}
          </span>
        </div>
      </div>
      {/* Timeline area */}
      <div
        className={`flex-1 relative ${!schedule ? 'cursor-crosshair' : ''}`}
        style={{ minWidth: `${12 * CELL_WIDTH}px` }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !schedule) {
            onGridMouseDown(e, initiative);
          }
        }}
      >
        {schedule && (
          <GanttBar
            initiative={initiative}
            schedule={schedule}
            perspective={perspective}
            onMouseDown={(e, type) => onBarMouseDown(e, type)}
            onDoubleClick={() => onBarDoubleClick(initiative.id)}
            isDragging={isRowDragging}
          />
        )}
      </div>
    </div>
  );
};

