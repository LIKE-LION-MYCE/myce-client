import styles from './Pagination.module.css';

function Pagination({ pageInfo, onPageChange }) {
  const { totalPages, number: currentPage } = pageInfo;

  if (totalPages === 0) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0); // 항상 첫 페이지

      if (currentPage > 2) pages.push('...');

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push('...');

      pages.push(totalPages - 1); 
    }

    return pages;
  };

  return (
    <div className={styles.paginationWrapper}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt;
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {typeof page === 'number' ? page + 1 : '...'}
        </button>
      ))}

      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;