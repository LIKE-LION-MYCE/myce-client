import React from 'react';
import { Link } from 'react-router-dom'; 

import styles from './FloatingChatButton.module.css';

export default function FloatingChatButton() {
  return (
    <Link to="/chat" className={styles.fab}>
      <span className={styles.icon}>
        💬
      </span>
      <span className={styles.badge}></span>
    </Link>
  );
}
