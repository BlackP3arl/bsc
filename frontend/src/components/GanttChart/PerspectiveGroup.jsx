export const PerspectiveGroup = ({ perspective, children }) => {
  return (
    <div className="perspective-group">
      {/* Header */}
      <div
        className="sticky left-0 z-10 px-4 py-2 font-bold text-sm border-b border-gray-300"
        style={{
          backgroundColor: perspective.color_header,
          color: 'white',
        }}
      >
        {perspective.name}
      </div>
      {/* Initiatives */}
      <div>{children}</div>
    </div>
  );
};

