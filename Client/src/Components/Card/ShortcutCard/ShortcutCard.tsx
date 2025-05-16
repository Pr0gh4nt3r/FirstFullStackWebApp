import React from "react";
import BaseCard from "@/Components/Card/BaseCard/BaseCard";

import styles from "./ShortcutCard.module.scss";

import {
  PasswordIcon,
  SettingsIcon,
  ChevronRightIcon,
} from "@/Components/Assets";

const ShortcutCard: React.FC = () => {
  return (
    <BaseCard className={styles.shortcutCard}>
      <ul>
        <li>
          <a href="/password">
            <span className={styles.baseItem}>
              <span className={styles.mainContent}>
                <span className={styles.iconContainer}>
                  <span className={styles.iconWrapper}>
                    <PasswordIcon />
                  </span>
                </span>
                <span className={styles.content}>Passwort aktualisieren</span>
              </span>
              <span className={styles.supplemental}>
                <ChevronRightIcon />
              </span>
            </span>
          </a>
        </li>
        <li>
          <a href="/settings">
            <span className={styles.baseItem}>
              <span className={styles.mainContent}>
                <span className={styles.iconContainer}>
                  <span className={styles.iconWrapper}>
                    <SettingsIcon />
                  </span>
                </span>
                <span className={styles.content}>Einstellungen bearbeiten</span>
              </span>
              <span className={styles.supplemental}>
                <ChevronRightIcon />
              </span>
            </span>
          </a>
        </li>
      </ul>
    </BaseCard>
  );
};

export default ShortcutCard;
