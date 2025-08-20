import { useState, useEffect, useCallback } from "react";
import { getExpos } from "../api/service/user/expoApi";
import { useLoading } from "../context/LoadingContext";

export const useExpoData = (initialSize = 10) => {
  const [expos, setExpos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: initialSize,
    totalElements: 0,
    totalPages: 0,
    last: false,
    first: true,
    number: 0, // current page number
  });
  const [filters, setFilters] = useState({
    sort: 'startDate,asc'
  });
  const { isLoading, setIsLoading } = useLoading(); // 전역 로딩 상태 사용
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchExpos = async () => {
      setError(null);
      try {
        const data = await getExpos({
          ...filters,
          page: pagination.page,
          size: pagination.size,
        });
        const sortedExpos = data.content.sort((a, b) => {
          if (a.startDate === b.startDate) {
            return new Date(a.endDate) - new Date(b.endDate);
          }
          return 0;
        });

        setExpos(sortedExpos);
        setPagination((prev) => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          first: data.first,
          number: data.number,
        }));
      } catch (err) {
        setError(err);
      }
    };

    fetchExpos();
  }, [filters, pagination.page, pagination.size, refreshTrigger]); // Add pagination dependencies

  return { expos, setExpos, filters, setFilters, isLoading, error, refresh, pagination, setPagination };
};