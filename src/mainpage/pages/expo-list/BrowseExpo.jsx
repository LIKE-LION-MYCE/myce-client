import React from "react";
import styles from "./BrowseExpo.module.css";
import SidebarFilters from "../../components/sidebar/SidebarFilters";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories";

export default function BrowseExpo() {
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
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (categoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError)
    return <div>Error loading categories: {categoriesError.message}</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <h2 className={styles.title}>
            전체 행사{" "}
            <span className={styles.count}>
              {pagination.totalElements}개의 행사
            </span>
          </h2>
          <ExpoCardList
            expos={expos}
            isLoading={isLoading}
            error={error}
            onBookmarkActionComplete={refresh}
          />
          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.first}
            >
              이전
            </button>
            <span>
              페이지 {pagination.number + 1} / {pagination.totalPages}
            </span>
            <button
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
