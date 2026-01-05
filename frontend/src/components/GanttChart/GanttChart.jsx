import { useState, useCallback, useEffect, useRef } from 'react';
import { GanttHeader } from './GanttHeader';
import { GanttRow } from './GanttRow';
import { PerspectiveGroup } from './PerspectiveGroup';
import { TimelineGrid } from './TimelineGrid';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useAutoSave } from '../../hooks/useAutoSave';
import { upsertSchedule, deleteSchedule } from '../../services/api';
import { Toast } from '../common/Toast';

const CELL_WIDTH = 80;
const ROW_HEIGHT = 40;

export const GanttChart = ({ data, onInitiativeClick }) => {
  const [schedules, setSchedules] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const gridRef = useRef(null);

  // Initialize schedules from data
  useEffect(() => {
    const scheduleMap = {};
    data.forEach((perspective) => {
      perspective.initiatives.forEach((initiative) => {
        if (initiative.schedule) {
          scheduleMap[initiative.id] = initiative.schedule;
        }
      });
    });
    setSchedules(scheduleMap);
  }, [data]);

  // Auto-save function
  const saveSchedule = useCallback(async (data) => {
    try {
      setSaving(true);
      // Extract initiativeId and scheduleData from the data object
      const { initiativeId, scheduleData } = data;
      await upsertSchedule(initiativeId, scheduleData);
      setToast({ message: 'Changes saved', type: 'success' });
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setToast({ message: 'Failed to save changes', type: 'error' });
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const { save: autoSave, flush } = useAutoSave(saveSchedule, 500);

  // Handle schedule changes
  const handleScheduleChange = useCallback(
    (initiativeId, scheduleData) => {
      setSchedules((prev) => ({
        ...prev,
        [initiativeId]: { ...prev[initiativeId], ...scheduleData },
      }));
      autoSave({ initiativeId, scheduleData });
    },
    [autoSave]
  );

  // Drag and drop
  const {
    dragging,
    dragType,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCreateBar,
  } = useDragAndDrop(handleScheduleChange, CELL_WIDTH);

  // Global mouse handlers for drag
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Handle bar double-click (delete)
  const handleBarDoubleClick = useCallback(
    async (initiativeId) => {
      if (window.confirm('Delete this schedule?')) {
        try {
          if (schedules[initiativeId]?.id) {
            await deleteSchedule(schedules[initiativeId].id);
          }
          setSchedules((prev) => {
            const next = { ...prev };
            delete next[initiativeId];
            return next;
          });
          setToast({ message: 'Schedule deleted', type: 'success' });
        } catch (error) {
          console.error('Failed to delete schedule:', error);
          setToast({ message: 'Failed to delete schedule', type: 'error' });
        }
      }
    },
    [schedules]
  );

  // Handle grid mouse down (start drag-to-create)
  const handleGridMouseDown = useCallback(
    (e, initiative) => {
      if (!schedules[initiative.id] && e.target === e.currentTarget) {
        handleCreateBar(e, initiative, gridRef.current);
      }
    },
    [schedules, handleCreateBar]
  );

  // Get all initiatives with updated schedules
  const getInitiativesWithSchedules = useCallback(
    (perspective) => {
      return perspective.initiatives.map((initiative) => ({
        ...initiative,
        schedule: schedules[initiative.id] || initiative.schedule,
      }));
    },
    [schedules]
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Saving indicator */}
      {saving && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm z-30">
          Saving...
        </div>
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <GanttHeader year={2026} />

      {/* Chart area */}
      <div className="flex-1 overflow-auto" ref={gridRef}>
        <div className="relative">
          <TimelineGrid numRows={data.reduce((sum, p) => sum + p.initiatives.length, 0)} />
          
          {data.map((perspective) => (
            <PerspectiveGroup key={perspective.id} perspective={perspective}>
              {getInitiativesWithSchedules(perspective).map((initiative) => (
                <GanttRow
                  key={initiative.id}
                  initiative={initiative}
                  perspective={perspective}
                  onInitiativeClick={onInitiativeClick}
                  onBarMouseDown={(e, type) => {
                    const schedule = initiative.schedule || schedules[initiative.id];
                    if (schedule) {
                      handleMouseDown(e, initiative, schedule, type, gridRef.current);
                    }
                  }}
                  onBarDoubleClick={handleBarDoubleClick}
                  onGridMouseDown={handleGridMouseDown}
                  isDragging={!!dragging}
                  draggingId={dragging}
                />
              ))}
            </PerspectiveGroup>
          ))}
        </div>
      </div>
    </div>
  );
};

