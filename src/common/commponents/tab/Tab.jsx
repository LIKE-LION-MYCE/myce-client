import { useState, useRef, useEffect } from 'react';
import styles from './Tab.module.css';

function Tab({ tabs = [], onTabChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderStyle, setSliderStyle] = useState({});
  const tabRefs = useRef([]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab) {
      setSliderStyle({
        width: currentTab.offsetWidth,
        left: currentTab.offsetLeft,
      });
    }
  }, [activeIndex, tabs]);

  const handleClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <div className={styles.tabWrapper}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          ref={(el) => (tabRefs.current[index] = el)}
          className={`${styles.tabItem} ${activeIndex === index ? styles.active : ''}`}
          onClick={() => handleClick(index)}
        >
          {tab}
        </div>
      ))}
      <div
        className={styles.slider}
        style={{
          width: sliderStyle.width,
          left: sliderStyle.left,
        }}
      />
    </div>
  );
}

export default Tab;