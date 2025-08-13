// BrowseExpo.jsx
import React from "react";
import styles from "./BrowseExpo.module.css";
import SidebarFilters from "../../components/sidebar/SidebarFilters";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import { useExpoData } from "../../../hooks/useExpoData";

export default function BrowseExpo() {
  const { expos, filters, setFilters, isLoading, error } = useExpoData();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <h2 className={styles.title}>
            전체 행사{" "}
            <span className={styles.count}>{expos.length}개의 행사</span>
          </h2>
          <ExpoCardList expos={expos} isLoading={isLoading} error={error} />
        </section>
        <aside className={styles.sidebar}>
          <SidebarFilters filters={filters} setFilters={setFilters} />
        </aside>
      </main>
    </div>
  );
}
