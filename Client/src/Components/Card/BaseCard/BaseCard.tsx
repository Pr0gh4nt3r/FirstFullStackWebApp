import React from "react";
import styles from "./BaseCard.module.scss";

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ children, className }) => {
  return (
    <div className={`${styles.baseCard} ${className || ""}`}>{children}</div>
  );
};

export default BaseCard;
