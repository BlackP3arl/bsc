const CELL_WIDTH = 80;

export const GanttBar = ({
  initiative,
  schedule,
  perspective,
  onMouseDown,
  onDoubleClick,
  isDragging = false,
}) => {
  if (!schedule) return null;

  const left = schedule.start_month * CELL_WIDTH;
  const width = (schedule.end_month - schedule.start_month + 1) * CELL_WIDTH;

  return (
    <div
      className={`absolute h-6 rounded cursor-move ${
        isDragging ? 'opacity-60' : 'opacity-100'
      } shadow-sm hover:shadow-md transition-all`}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        backgroundColor: perspective.color_bar,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      onMouseDown={(e) => onMouseDown(e, 'move')}
      onDoubleClick={onDoubleClick}
      title={`${initiative.code}: ${initiative.name} (${schedule.start_month + 1}/${schedule.year} - ${schedule.end_month + 1}/${schedule.year})`}
    >
      {/* Resize handles */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white hover:bg-opacity-30 border-r-2 border-white border-opacity-50 z-10"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMouseDown(e, 'resize-start');
        }}
        title="Drag to adjust start month"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white hover:bg-opacity-30 border-l-2 border-white border-opacity-50 z-10"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMouseDown(e, 'resize-end');
        }}
        title="Drag to adjust end month"
      />
      {/* Bar label */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium truncate px-1">
        {initiative.code}
      </div>
    </div>
  );
};

