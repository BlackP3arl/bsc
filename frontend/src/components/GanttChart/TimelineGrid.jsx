import { QUARTERS } from '../../utils/dateUtils';

const CELL_WIDTH = 80;
const ROW_HEIGHT = 40;
const INITIATIVE_COLUMN_WIDTH = 250;

export const TimelineGrid = ({ numRows, year = 2026 }) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Month cells */}
      {months.map((month) => {
        const quarter = QUARTERS.findIndex(
          (q) => month >= q.start && month <= q.end
        );
        const isQuarterStart = month % 3 === 0;

        return (
          <div
            key={month}
            className={`absolute top-0 bottom-0 border-r ${
              isQuarterStart
                ? 'border-gray-400 bg-gray-50'
                : 'border-gray-200 bg-white'
            }`}
            style={{
              left: `${INITIATIVE_COLUMN_WIDTH + month * CELL_WIDTH}px`,
              width: `${CELL_WIDTH}px`,
            }}
          />
        );
      })}
    </div>
  );
};

