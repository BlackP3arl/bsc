import { useState } from 'react';
import { getGanttData } from '../../services/api';
import { MONTHS } from '../../utils/dateUtils';

export const ExportModal = ({ isOpen, onClose }) => {
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const data = await getGanttData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gantt-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const data = await getGanttData();
      
      // Flatten to CSV format
      const rows = [['Code', 'Name', 'Start Month', 'End Month', 'Year']];
      
      data.forEach((perspective) => {
        perspective.initiatives.forEach((initiative) => {
          if (initiative.schedule) {
            rows.push([
              initiative.code,
              initiative.name,
              MONTHS[initiative.schedule.start_month],
              MONTHS[initiative.schedule.end_month],
              initiative.schedule.year.toString(),
            ]);
          }
        });
      });

      const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gantt-schedule-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Export Data</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExportJSON}
            disabled={exporting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export as JSON'}
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export as CSV'}
          </button>
          
          <button
            onClick={handlePrint}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Print View
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

