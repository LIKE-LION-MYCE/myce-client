import { useState, useEffect } from "react";
import { getExpos } from "../api/service/user/expoApi";

export const useExpoData = () => {
  const [expos, setExpos] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExpos(filters);
        setExpos(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpos();
  }, [filters]);

  return { expos, filters, setFilters, isLoading, error };
};
