import { useState, useEffect } from "react";

export interface UseVisibilityWarningReturn {
  showVisibilityWarning: boolean;
}

export const useVisibilityWarning = (isAnalyzing: boolean): UseVisibilityWarningReturn => {
  const [showVisibilityWarning, setShowVisibilityWarning] = useState(false);

  useEffect(() => {
    let warningTimeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden && isAnalyzing) {
        warningTimeout = setTimeout(() => {
          setShowVisibilityWarning(true);
        }, 2000);
      } else {
        setShowVisibilityWarning(false);
        if (warningTimeout) {
          clearTimeout(warningTimeout);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
    };
  }, [isAnalyzing]);

  return { showVisibilityWarning };
};
