// src/reportWebVitals.ts
import type { Metric } from "web-vitals";
import * as webVitals from "web-vitals";

/**
 * Führt die einzelnen Web‑Vitals‑Messungen aus und ruft
 * die gegebene Callback‑Funktion mit dem jeweiligen Metric‑Objekt auf.
 *
 * @param onPerfEntry - Optionaler Callback (metric: Metric) => void
 */
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (typeof onPerfEntry === "function") {
    webVitals.onCLS(onPerfEntry);
    webVitals.onINP(onPerfEntry);
    webVitals.onFCP(onPerfEntry);
    webVitals.onLCP(onPerfEntry);
    webVitals.onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
