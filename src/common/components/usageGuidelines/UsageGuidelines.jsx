import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./UsageGuidelines.module.css";

const UsageGuidelines = ({ type }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const expoGuidelines = [
    {
      title: t('usageGuidelines.expo.sections.eligibility.title'),
      items: t('usageGuidelines.expo.sections.eligibility.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.expo.sections.approval.title'),
      items: t('usageGuidelines.expo.sections.approval.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.expo.sections.precautions.title'),
      items: t('usageGuidelines.expo.sections.precautions.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.expo.sections.refund.title'),
      items: t('usageGuidelines.expo.sections.refund.items', { returnObjects: true })
    }
  ];

  const adGuidelines = [
    {
      title: t('usageGuidelines.ad.sections.regulations.title'),
      items: t('usageGuidelines.ad.sections.regulations.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.ad.sections.imageSpecs.title'),
      items: t('usageGuidelines.ad.sections.imageSpecs.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.ad.sections.policy.title'),
      items: t('usageGuidelines.ad.sections.policy.items', { returnObjects: true })
    },
    {
      title: t('usageGuidelines.ad.sections.refund.title'),
      items: t('usageGuidelines.ad.sections.refund.items', { returnObjects: true })
    }
  ];

  const guidelines = type === "expo" ? expoGuidelines : adGuidelines;
  const title = t(`usageGuidelines.${type}.title`);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className={styles.title}>{title}</h3>
        <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ""}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className={styles.content}>
          {guidelines.map((section, index) => (
            <div key={index} className={styles.section}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ul className={styles.itemList}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsageGuidelines;