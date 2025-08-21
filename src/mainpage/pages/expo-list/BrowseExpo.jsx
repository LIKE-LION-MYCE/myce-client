import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styles from "./BrowseExpo.module.css";
import SidebarFilters from "../../components/sidebar/SidebarFilters";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories";

export default function BrowseExpo() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const {
    expos,
    filters,
    setFilters,
    isLoading,
    error,
    refresh,
    pagination,
    setPagination,
  } = useExpoData(16);

  // 클라이언트 사이드 검색 및 상태 필터링
  const filteredExpos = React.useMemo(() => {
    let result = expos || [];
    
    // 키워드 필터링 (제목만)
    if (filters.keyword && result.length) {
      const query = filters.keyword.toLowerCase();
      result = result.filter(expo => 
        expo.title.toLowerCase().includes(query)
      );
    }
    
    // 상태 필터링 (클라이언트 사이드)
    if (filters.status && filters.status !== 'all' && result.length) {
      result = result.filter(expo => expo.status === filters.status);
    }
    
    return result;
  }, [expos, filters.keyword, filters.status]);
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // URL에서 search와 status 파라미터를 읽어서 필터에 적용
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const statusQuery = searchParams.get('status');
    
    const newFilters = {};
    
    if (searchQuery && searchQuery !== filters.keyword) {
      newFilters.keyword = searchQuery;
    }
    
    if (statusQuery && statusQuery !== filters.status) {
      newFilters.status = statusQuery;
    }
    
    if (Object.keys(newFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  }, [searchParams, setFilters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (categoriesLoading)
    return (
      <div>
        {t("homepage.browseExpo.loadingCategories", "Loading categories...")}
      </div>
    );
  if (categoriesError)
    return (
      <div>
        {t(
          "homepage.browseExpo.errorCategories",
          "Error loading categories: {{message}}",
          { message: categoriesError.message }
        )}
      </div>
    );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <h2 className={styles.title}>
            전체 행사{" "}
            <span className={styles.count}>
              {filteredExpos?.length || 0}개의 행사
            </span>
          </h2>
          <ExpoCardList
            expos={filteredExpos}
            isLoading={isLoading}
            error={error}
            onBookmarkActionComplete={refresh}
          />

          {/* Simple Page Numbers */}
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.first}
            >
              이전
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i)
              .filter((page) => {
                const currentPage = pagination.number;
                const totalPages = pagination.totalPages;

                // 총 페이지가 5 이하면 모든 페이지 표시
                if (totalPages <= 5) return true;

                // 현재 페이지 기준으로 앞뒤 2개씩 (총 5개) 표시
                const start = Math.max(
                  0,
                  Math.min(currentPage - 2, totalPages - 5)
                );
                const end = Math.min(totalPages - 1, start + 4);

                return page >= start && page <= end;
              })
              .map((page) => (
                <button
                  key={page}
                  className={`${styles.paginationBtn} ${styles.pageNumber} ${
                    page === pagination.number ? styles.active : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page + 1}
                </button>
              ))}

            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.last}
            >
              다음
            </button>
          </div>
        </section>
        <aside className={styles.sidebar}>
          <SidebarFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
          />
        </aside>
      </main>
    </div>
  );
}
