import React from 'react';
import styles from './TrafficLight.module.css';

const TrafficLight = ({ level }) => {
  // level: LOW(여유) - 초록, MODERATE(보통) - 노랑, HIGH(혼잡) - 빨강, VERY_HIGH(매우혼잡) - 빨강3개
  
  const getTrafficLightConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          red: false,
          yellow: false,
          green: true,
        };
      case 'MODERATE':
        return {
          red: false,
          yellow: true,
          green: false,
        };
      case 'HIGH':
        return {
          red: true,
          yellow: false,
          green: false,
        };
      case 'VERY_HIGH':
        return {
          red: true,
          yellow: true, // 빨강색으로 표시
          green: true,  // 빨강색으로 표시
        };
      default:
        return {
          red: false,
          yellow: false,
          green: true,
        };
    }
  };

  const config = getTrafficLightConfig(level);
  const isVeryHigh = level === 'VERY_HIGH';

  return (
    <div className={styles.trafficLight}>
      <div 
        className={`${styles.light} ${styles.redLight} ${
          config.red ? styles.redActive : ''
        }`}
      />
      <div 
        className={`${styles.light} ${styles.yellowLight} ${
          config.yellow ? (isVeryHigh ? styles.redActive : styles.yellowActive) : ''
        }`}
      />
      <div 
        className={`${styles.light} ${styles.greenLight} ${
          config.green ? (isVeryHigh ? styles.redActive : styles.greenActive) : ''
        }`}
      />
    </div>
  );
};

export default TrafficLight;