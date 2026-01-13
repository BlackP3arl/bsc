export const TeamFilter = ({ teams, selectedTeamIds, onToggleTeam }) => {
  if (!teams || teams.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm font-medium text-gray-700">Filter by Team:</label>
      <div className="flex items-center gap-2 flex-wrap">
        {teams.map((team) => {
          const isSelected = selectedTeamIds.includes(team.id);
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onToggleTeam(team.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <span>{team.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

