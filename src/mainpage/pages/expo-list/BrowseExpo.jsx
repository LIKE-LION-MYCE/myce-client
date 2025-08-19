import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./BrowseExpo.module.css";
import SidebarFilters from "../../components/sidebar/SidebarFilters";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories";

export default function BrowseExpo() {
  const { t } = useTranslation();
  const { expos, filters, setFilters, isLoading, error, refresh } =
    useExpoData();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  if (categoriesLoading) return <div>{t('homepage.browseExpo.loadingCategories', 'Loading categories...')}</div>;
  if (categoriesError)
    return <div>{t('homepage.browseExpo.errorCategories', 'Error loading categories: {{message}}', { message: categoriesError.message })}</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <h2 className={styles.title}>
            {t('homepage.browseExpo.title', '전체 행사')}{" "}
            <span className={styles.count}>{t('homepage.browseExpo.count', '{{count}}개의 행사', { count: expos.length })}</span>
          </h2>
          <ExpoCardList
            expos={expos}
            isLoading={isLoading}
            error={error}
            onBookmarkActionComplete={refresh}
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
