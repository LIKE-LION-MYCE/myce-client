import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AccessDeniedPage.module.css';
import unauthorizedImage from './unauthorized.png'; // 이미지 import

const AccessDeniedPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.overlayContainer}>
                    <img
                        src={unauthorizedImage}
                        alt="Unauthorized"
                        className={styles.overlayImage}
                    />
                    <h1 className={styles.title}>403</h1>
                </div>
                <p className={styles.message}>
                    이 페이지에 접근할 권한이 없습니다.
                </p>
                <Link to="/" className={styles.link}>
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
};

export default AccessDeniedPage;