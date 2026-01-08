import { MONTHS_SHORT } from '../../utils/dateUtils';

export const ScheduleSummary = ({ data, onInitiativeClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">No data available</div>
    );
  }

  // Collect all scheduled initiatives
  const scheduledInitiatives = [];
  data.forEach((perspective) => {
    perspective.initiatives.forEach((initiative) => {
      if (initiative.schedule) {
        scheduledInitiatives.push({
          ...initiative,
          perspective: perspective.name,
        });
      }
    });
  });

  // Sort by start month
  scheduledInitiatives.sort((a, b) => {
    if (a.schedule.start_month !== b.schedule.start_month) {
      return a.schedule.start_month - b.schedule.start_month;
    }
    return a.schedule.end_month - b.schedule.end_month;
  });

  const totalInitiatives = data.reduce(
    (sum, p) => sum + p.initiatives.length,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Schedule Summary</h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {scheduledInitiatives.length}
          </span>{' '}
          of {totalInitiatives} initiatives scheduled
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {scheduledInitiatives.length === 0 ? (
          <div className="text-sm text-gray-500">No initiatives scheduled yet</div>
        ) : (
          scheduledInitiatives.map((initiative) => (
            <div
              key={initiative.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onInitiativeClick(initiative)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {initiative.code}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {initiative.name}
                  </div>
                </div>
              </div>
              {initiative.schedule && (
                <div className="mt-2 text-xs text-gray-500">
                  {MONTHS_SHORT[initiative.schedule.start_month]} -{' '}
                  {MONTHS_SHORT[initiative.schedule.end_month]} {initiative.schedule.year}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};


