// BrowseExpo.jsx
import React from "react";
import styles from "./BrowseExpo.module.css";
import SidebarFilters from "../../components/sidebar/SidebarFilters";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories";

export default function BrowseExpo() {
  const { expos, setExpos, filters, setFilters, isLoading, error } =
    useExpoData();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const handleBookmarkToggle = (expoId) => {
    console.log(`Toggling bookmark for expo ID: ${expoId}`);
    setExpos((prevExpos) => {
      const updatedExpos = prevExpos.map((expo) => {
        if (expo.expoId === expoId) {
          console.log(
            `Expo ${expoId}: Toggling isBookmark from ${
              expo.isBookmark
            } to ${!expo.isBookmark}`
          );
          return { ...expo, isBookmark: !expo.isBookmark };
        }
        return expo;
      });
      console.log("Updated expos array:", updatedExpos);
      return updatedExpos;
    });
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
            <span className={styles.count}>{expos.length}개의 행사</span>
          </h2>
          <ExpoCardList
            expos={expos}
            isLoading={isLoading}
            error={error}
            onBookmarkToggle={handleBookmarkToggle}
          />
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
