import React from "react";
import BaseCard from "@/Components/Card/BaseCard/BaseCard";

import styles from "./AccountCard.module.scss";

import { EmailIcon, UserIcon } from "@/Components/Assets";

interface AccountCardProps {
  userName: string;
  anonEmail: string;
  memberSince: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  userName,
  anonEmail,
  memberSince,
}) => {
  return (
    <>
      <h1 className={styles.mainTitle}>Konto</h1>
      <h2 className={styles.subtitle}>Details zum Konto</h2>
      <BaseCard className={styles.accountCard}>
        <div className={styles.banner}>Mitglied seit {memberSince}</div>
        <div className={styles.accountInfo}>
          <div className={styles.infoItem}>
            <UserIcon className={styles.icon} />
            <span>{userName}</span>
          </div>
          <div className={styles.infoItem}>
            <EmailIcon className={styles.icon} />
            <span>{anonEmail}</span>
          </div>
        </div>
      </BaseCard>
      <h2 className={styles.subtitle}>Schnellzugriff</h2>
    </>
  );
};

export default AccountCard;
