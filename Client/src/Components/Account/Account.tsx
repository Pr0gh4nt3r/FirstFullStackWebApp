// Profile.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "@/Components/Spinner/Spinner";
import Sidebar from "@/Components/Sidebar/Sidebar";
import { AccountCard, ShortcutCard } from "@/Components/Card";
import { IAccountDocument } from "../../../../Server/src/Interfaces/account.interface";
import { getUserFromDB } from "@/Helpers/data.helper";

import styles from "./Account.module.scss";

const Account: React.FC = () => {
  const [account, setAccount] = useState<IAccountDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          toast.error("Bitte zuerst einloggen!", {
            position: "top-right",
          });
          return;
        }

        const _account = await getUserFromDB();
        setAccount(_account);
      } catch (err: any) {
        toast.error(err.message || "Es ist ein Fehler aufgetreten!", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!account && !loading) return <Navigate to="/" />; // kein User? zurück zum Login

  const isRootAccountPage = location.pathname === "/account";
  const isSecurityPage = location.pathname === "/account/security";
  const [local, domain] = account?.email.split("@") || ["", ""];
  const anonEmail = `${local.charAt(0)}•••@${domain}`;
  const memberSince = new Date(account?.createdAt || "").toLocaleDateString(
    "de-DE",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  return (
    <div className={styles.accountPage}>
      {loading && (
        <div className={styles.overlay}>
          <Spinner />
        </div>
      )}
      <Sidebar />
      <main className={styles.accountMain}>
        {isRootAccountPage && (
          <>
            <AccountCard
              userName={account?.userName || ""}
              anonEmail={anonEmail}
              memberSince={memberSince}
            />
            <ShortcutCard />
          </>
        )}
        {/* {isSecurityPage && <Security />} */}
      </main>
    </div>
  );
};

export default Account;
