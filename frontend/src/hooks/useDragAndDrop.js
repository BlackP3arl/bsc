import { useState, useCallback, useRef } from 'react';
import { getMonthFromPosition, clampMonth } from '../utils/dateUtils';

const CELL_WIDTH = 80; // Width of each month cell in pixels
const INITIATIVE_COLUMN_WIDTH = 250; // Width of the initiative column

export const useDragAndDrop = (onScheduleChange, cellWidth = CELL_WIDTH) => {
  const [dragging, setDragging] = useState(null);
  const [dragType, setDragType] = useState(null); // 'move', 'resize-start', 'resize-end', 'create'
  const dragStartRef = useRef(null);
  const initialScheduleRef = useRef(null);
  const gridElementRef = useRef(null);
  const creatingInitiativeRef = useRef(null);

  const handleMouseDown = useCallback(
    (e, initiative, schedule, type = 'move', gridElement = null) => {
      e.preventDefault();
      e.stopPropagation();

      // Store grid element reference for accurate position calculation
      if (gridElement) {
        gridElementRef.current = gridElement;
      }

      if (type === 'create') {
        // Starting to create a new bar by dragging
        if (!schedule && gridElement) {
          const rect = gridElement.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const timelineX = Math.max(0, x - INITIATIVE_COLUMN_WIDTH);
          const startMonth = getMonthFromPosition(timelineX, cellWidth);
          const clampedStartMonth = clampMonth(startMonth);

          setDragging(initiative.id);
          setDragType('create');
          creatingInitiativeRef.current = initiative;
          dragStartRef.current = {
            x: e.clientX,
            startMonth: clampedStartMonth,
            gridLeft: rect.left,
          };
          initialScheduleRef.current = {
            start_month: clampedStartMonth,
            end_month: clampedStartMonth,
            year: 2026,
          };
          return;
        }
      }

      if (!schedule) return;

      setDragging(initiative.id);
      setDragType(type);
      
      // Store grid-relative position for accurate monthly increment calculation
      let startX = e.clientX;
      if (gridElement) {
        const rect = gridElement.getBoundingClientRect();
        startX = e.clientX - rect.left;
        gridElementRef.current = gridElement;
      }
      
      dragStartRef.current = {
        x: startX,
        clientX: e.clientX, // Keep clientX for fallback
        initialStart: schedule.start_month,
        initialEnd: schedule.end_month,
      };
      initialScheduleRef.current = { ...schedule };
    },
    [cellWidth]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging || !dragStartRef.current) return;

      // Use grid-relative position for more accurate monthly increments
      let deltaMonths = 0;
      let currentMonth = null;

      if (dragType === 'create' && gridElementRef.current) {
        // Creating a new bar by dragging
        const rect = gridElementRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const timelineX = Math.max(0, x - INITIATIVE_COLUMN_WIDTH);
        currentMonth = getMonthFromPosition(timelineX, cellWidth);
        const clampedCurrentMonth = clampMonth(currentMonth);

        const startMonth = dragStartRef.current.startMonth;
        const endMonth = clampedCurrentMonth;

        // Ensure start <= end
        const newStart = Math.min(startMonth, endMonth);
        const newEnd = Math.max(startMonth, endMonth);

        if (onScheduleChange && creatingInitiativeRef.current) {
          onScheduleChange(creatingInitiativeRef.current.id, {
            start_month: newStart,
            end_month: newEnd,
            year: 2026,
          });
        }
        return;
      }

      // For existing bars, calculate delta based on grid position for accurate monthly increments
      if (gridElementRef.current) {
        const rect = gridElementRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const startX = dragStartRef.current.x; // Already grid-relative
        const deltaX = currentX - startX;
        deltaMonths = Math.round(deltaX / cellWidth);
      } else {
        // Fallback to clientX-based calculation
        const deltaX = e.clientX - (dragStartRef.current.clientX || dragStartRef.current.x);
        deltaMonths = Math.round(deltaX / cellWidth);
      }

      if (!initialScheduleRef.current) return;

      let newStart = initialScheduleRef.current.start_month;
      let newEnd = initialScheduleRef.current.end_month;

      if (dragType === 'move') {
        newStart = clampMonth(initialScheduleRef.current.start_month + deltaMonths);
        newEnd = clampMonth(initialScheduleRef.current.end_month + deltaMonths);
      } else if (dragType === 'resize-start') {
        newStart = clampMonth(initialScheduleRef.current.start_month + deltaMonths);
        if (newStart > newEnd) newStart = newEnd;
      } else if (dragType === 'resize-end') {
        newEnd = clampMonth(initialScheduleRef.current.end_month + deltaMonths);
        if (newEnd < newStart) newEnd = newStart;
      }

      // Update optimistically
      if (onScheduleChange) {
        onScheduleChange(dragging, {
          start_month: newStart,
          end_month: newEnd,
          year: initialScheduleRef.current.year,
        });
      }
    },
    [dragging, dragType, cellWidth, onScheduleChange]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      // Final save will be handled by auto-save
      setDragging(null);
      setDragType(null);
      dragStartRef.current = null;
      initialScheduleRef.current = null;
      creatingInitiativeRef.current = null;
      gridElementRef.current = null;
    }
  }, [dragging]);

  const handleCreateBar = useCallback(
    (e, initiative, gridElement) => {
      if (!gridElement) return;

      // Start drag-to-create instead of creating immediately
      handleMouseDown(e, initiative, null, 'create', gridElement);
    },
    [handleMouseDown]
  );

  return {
    dragging,
    dragType,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCreateBar,
  };
};

