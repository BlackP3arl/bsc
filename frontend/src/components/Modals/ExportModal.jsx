import { useState } from 'react';
import { getGanttData } from '../../services/api';
import { MONTHS, MONTHS_SHORT, QUARTERS } from '../../utils/dateUtils';
import jsPDF from 'jspdf';

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

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const data = await getGanttData();
      
      // Create new PDF document in landscape orientation
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // Constants for layout
      const year = 2026;
      const margin = 10; // mm
      const headerHeight = 20; // mm
      const rowHeight = 6; // mm per initiative row
      const monthWidth = 20; // mm per month (12 months = 240mm total)
      const initiativesColumnWidth = 50; // mm for initiatives column
      const initiativesColumnStartX = margin;
      const timelineStartX = margin + initiativesColumnWidth;
      const timelineStartY = margin + headerHeight;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const timelineWidth = pageWidth - margin - timelineStartX;
      
      // Helper function to convert hex color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 66, g: 139, b: 202 }; // Default blue
      };
      
      // Draw header with title
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('ICT Scorecard Gantt Chart', margin, margin + 8);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, margin + 8);
      doc.setTextColor(0, 0, 0);
      
      // Draw timeline header
      let currentY = timelineStartY;
      
      // Draw Initiatives column header
      doc.setFillColor(240, 240, 240);
      doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 14, 'F');
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 14);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Initiatives', initiativesColumnStartX + initiativesColumnWidth / 2, currentY + 8, { align: 'center' });
      
      // Draw quarter row
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      QUARTERS.forEach((quarter) => {
        const quarterX = timelineStartX + (quarter.start * monthWidth);
        const quarterWidth = (quarter.end - quarter.start + 1) * monthWidth;
        
        // Draw quarter background
        doc.setFillColor(240, 240, 240);
        doc.rect(quarterX, currentY, quarterWidth, 8, 'F');
        
        // Draw quarter border
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.3);
        doc.rect(quarterX, currentY, quarterWidth, 8);
        
        // Draw quarter label
        doc.setTextColor(0, 0, 0);
        doc.text(
          `${quarter.label} ${year}`,
          quarterX + quarterWidth / 2,
          currentY + 5,
          { align: 'center' }
        );
      });
      
      currentY += 8;
      
      // Draw month row (initiatives column continues)
      doc.setFillColor(240, 240, 240);
      doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 6, 'F');
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 6);
      
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      for (let month = 0; month < 12; month++) {
        const monthX = timelineStartX + (month * monthWidth);
        const isQuarterStart = month % 3 === 0;
        
        // Draw month cell background
        if (isQuarterStart) {
          doc.setFillColor(250, 250, 250);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(monthX, currentY, monthWidth, 6, 'F');
        
        // Draw month border
        doc.setDrawColor(isQuarterStart ? 150 : 200);
        doc.setLineWidth(0.1);
        doc.rect(monthX, currentY, monthWidth, 6);
        
        // Draw month label
        doc.setTextColor(0, 0, 0);
        doc.text(
          MONTHS_SHORT[month],
          monthX + monthWidth / 2,
          currentY + 4,
          { align: 'center' }
        );
      }
      
      currentY += 6;
      
      // Draw horizontal line below header
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(initiativesColumnStartX, currentY, timelineStartX + timelineWidth, currentY);
      // Draw vertical line separating initiatives column from timeline
      doc.line(timelineStartX, timelineStartY, timelineStartX, currentY);
      currentY += 2;
      
      // Process each perspective and draw initiatives
      data.forEach((perspective) => {
        // Check if we need a new page
        const perspectiveInitiatives = perspective.initiatives || [];
        const estimatedHeight = 8 + (perspectiveInitiatives.length * rowHeight);
        
        if (currentY + estimatedHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
          
          // Redraw Initiatives column header
          doc.setFillColor(240, 240, 240);
          doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 14, 'F');
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(0.3);
          doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 14);
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text('Initiatives', initiativesColumnStartX + initiativesColumnWidth / 2, currentY + 8, { align: 'center' });
          
          // Redraw quarter row
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          QUARTERS.forEach((quarter) => {
            const quarterX = timelineStartX + (quarter.start * monthWidth);
            const quarterWidth = (quarter.end - quarter.start + 1) * monthWidth;
            doc.setFillColor(240, 240, 240);
            doc.rect(quarterX, currentY, quarterWidth, 8, 'F');
            doc.setDrawColor(150, 150, 150);
            doc.setLineWidth(0.3);
            doc.rect(quarterX, currentY, quarterWidth, 8);
            doc.text(
              `${quarter.label} ${year}`,
              quarterX + quarterWidth / 2,
              currentY + 5,
              { align: 'center' }
            );
          });
          currentY += 8;
          
          // Redraw month row
          doc.setFillColor(240, 240, 240);
          doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 6, 'F');
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(0.3);
          doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, 6);
          
          doc.setFontSize(8);
          for (let month = 0; month < 12; month++) {
            const monthX = timelineStartX + (month * monthWidth);
            const isQuarterStart = month % 3 === 0;
            if (isQuarterStart) {
              doc.setFillColor(250, 250, 250);
            } else {
              doc.setFillColor(255, 255, 255);
            }
            doc.rect(monthX, currentY, monthWidth, 6, 'F');
            doc.setDrawColor(isQuarterStart ? 150 : 200);
            doc.setLineWidth(0.1);
            doc.rect(monthX, currentY, monthWidth, 6);
            doc.text(
              MONTHS_SHORT[month],
              monthX + monthWidth / 2,
              currentY + 4,
              { align: 'center' }
            );
          }
          currentY += 6;
          
          // Draw horizontal and vertical lines
          doc.setDrawColor(100, 100, 100);
          doc.setLineWidth(0.5);
          doc.line(initiativesColumnStartX, currentY, timelineStartX + timelineWidth, currentY);
          doc.line(timelineStartX, margin, timelineStartX, currentY);
          currentY += 2;
        }
        
        // Draw perspective header (spans both columns)
        const rgb = hexToRgb(perspective.color_header || '#428BCA');
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth + timelineWidth, 6, 'F');
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(perspective.name, timelineStartX + 2, currentY + 4.5);
        doc.setTextColor(0, 0, 0);
        currentY += 6;
        
        // Draw grid lines for months
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        for (let month = 0; month <= 12; month++) {
          const monthX = timelineStartX + (month * monthWidth);
          doc.line(monthX, currentY, monthX, currentY + (perspectiveInitiatives.length * rowHeight));
        }
        
        // Draw vertical line for initiatives column
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.3);
        doc.line(timelineStartX, currentY, timelineStartX, currentY + (perspectiveInitiatives.length * rowHeight));
        
        // Draw each initiative row
        perspectiveInitiatives.forEach((initiative) => {
          // Draw row background for both columns
          doc.setFillColor(255, 255, 255);
          doc.rect(initiativesColumnStartX, currentY, initiativesColumnWidth, rowHeight, 'F');
          doc.rect(timelineStartX, currentY, timelineWidth, rowHeight, 'F');
          
          // Draw initiative code and name in left column
          doc.setFontSize(7);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          const codeY = currentY + 3;
          doc.text(initiative.code || '', initiativesColumnStartX + 2, codeY, { maxWidth: initiativesColumnWidth - 4 });
          
          doc.setFontSize(6);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(100, 100, 100);
          const nameY = currentY + 5;
          const nameText = initiative.name || '';
          // Truncate name if too long
          const truncatedName = nameText.length > 30 ? nameText.substring(0, 27) + '...' : nameText;
          doc.text(truncatedName, initiativesColumnStartX + 2, nameY, { maxWidth: initiativesColumnWidth - 4 });
          doc.setTextColor(0, 0, 0);
          
          // Draw horizontal line
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.1);
          doc.line(initiativesColumnStartX, currentY + rowHeight, timelineStartX + timelineWidth, currentY + rowHeight);
          
          // Draw initiative bar if scheduled
          if (initiative.schedule) {
            const schedule = initiative.schedule;
            const barStartX = timelineStartX + (schedule.start_month * monthWidth);
            const barWidth = (schedule.end_month - schedule.start_month + 1) * monthWidth;
            const barY = currentY + 1;
            const barHeight = rowHeight - 2;
            
            // Get bar color from perspective
            const barRgb = hexToRgb(perspective.color_bar || '#428BCA');
            doc.setFillColor(barRgb.r, barRgb.g, barRgb.b);
            doc.rect(barStartX, barY, barWidth, barHeight, 'F');
            
            // Draw bar border
            doc.setDrawColor(barRgb.r * 0.7, barRgb.g * 0.7, barRgb.b * 0.7);
            doc.setLineWidth(0.2);
            doc.rect(barStartX, barY, barWidth, barHeight);
          }
          
          currentY += rowHeight;
        });
        
        // Add spacing after perspective
        currentY += 2;
      });
      
      // Save the PDF
      const fileName = `gantt-chart-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      onClose();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF');
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
            onClick={handleExportPDF}
            disabled={exporting}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export as PDF'}
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

