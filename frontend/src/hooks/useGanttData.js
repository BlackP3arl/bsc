import { useState, useEffect } from 'react';
import { getGanttData } from '../services/api';

export const useGanttData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getGanttData();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching gantt data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};


