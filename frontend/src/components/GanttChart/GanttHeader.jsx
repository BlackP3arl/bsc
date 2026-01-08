import { MONTHS_SHORT, QUARTERS } from '../../utils/dateUtils';

const CELL_WIDTH = 80;
const INITIATIVE_COLUMN_WIDTH = 250;

export const GanttHeader = ({ year = 2026 }) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-300 flex">
      {/* Initiatives column header */}
      <div
        className="sticky left-0 z-21 bg-white border-r border-gray-300 flex flex-col"
        style={{ width: `${INITIATIVE_COLUMN_WIDTH}px` }}
      >
        {/* Quarter row placeholder */}
        <div className="flex items-center justify-center border-b border-gray-200" style={{ height: '30px' }}>
          <span className="text-sm font-semibold text-gray-700">Initiatives</span>
        </div>
        {/* Month row placeholder */}
        <div className="flex items-center justify-center" style={{ height: '30px' }}>
          {/* Empty space to match timeline height */}
        </div>
      </div>
      
      {/* Timeline header */}
      <div className="flex-1">
        {/* Quarter row */}
        <div className="flex relative" style={{ height: '30px' }}>
          {QUARTERS.map((quarter, idx) => (
            <div
              key={quarter.label}
              className="absolute border-r-2 border-gray-400 bg-gray-100 flex items-center justify-center font-semibold text-sm"
              style={{
                left: `${quarter.start * CELL_WIDTH}px`,
                width: `${(quarter.end - quarter.start + 1) * CELL_WIDTH}px`,
                height: '30px',
              }}
            >
              {quarter.label} {year}
            </div>
          ))}
        </div>
        {/* Month row */}
        <div className="flex relative" style={{ height: '30px' }}>
          {months.map((month) => {
            const isQuarterStart = month % 3 === 0;
            return (
              <div
                key={month}
                className={`absolute border-r flex items-center justify-center text-xs font-medium ${
                  isQuarterStart ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{
                  left: `${month * CELL_WIDTH}px`,
                  width: `${CELL_WIDTH}px`,
                  height: '30px',
                }}
              >
                {MONTHS_SHORT[month]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

