import { useRef, useCallback } from 'react';

export const useAutoSave = (saveFunction, delay = 500) => {
  const timeoutRef = useRef(null);
  const pendingSaveRef = useRef(null);

  const save = useCallback(
    (data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Store the latest data
      pendingSaveRef.current = data;

      // Set new timeout
      timeoutRef.current = setTimeout(async () => {
        if (pendingSaveRef.current) {
          try {
            await saveFunction(pendingSaveRef.current);
            pendingSaveRef.current = null;
          } catch (error) {
            console.error('Auto-save failed:', error);
            throw error;
          }
        }
      }, delay);
    },
    [saveFunction, delay]
  );

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pendingSaveRef.current) {
      const data = pendingSaveRef.current;
      pendingSaveRef.current = null;
      await saveFunction(data);
    }
  }, [saveFunction]);

  return { save, flush };
};


