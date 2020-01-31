import React from 'react';
import styles from './index.less';

export const SectionTitle = ({ children }) => (
  <h2 className={styles.commSectionTitle}>
    <span>{children}</span>
  </h2>
);

export const MainTitle = ({ children }) => (
  <h2 className={styles.commMainTitle}>
    <span>{children}</span>
  </h2>
);

export const BlockTitle = ({ children }) => (
  <h2 className={styles.commBlockTitle}>
    <span>{children}</span>
  </h2>
);
