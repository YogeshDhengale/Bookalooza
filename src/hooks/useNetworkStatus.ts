import { useEffect, useState } from "react";

const useNetworkStatus = (): { isOnline: boolean } => {
  const [isOnline, setOnline] = useState<boolean>(navigator.onLine);

  const updateNetworkStatus = (isOn: boolean) => () => {
    setOnline(isOn);
  };

  useEffect(() => {
    setOnline(navigator.onLine); // Ensure correct initial state

    // Add event listeners
    window.addEventListener("load", updateNetworkStatus(navigator.onLine))
    window.addEventListener("online", updateNetworkStatus(true));
    window.addEventListener("offline", updateNetworkStatus(false));

    return () => {
      // Remove event listeners
      window.addEventListener("load", updateNetworkStatus(navigator.onLine))
      window.removeEventListener("online", updateNetworkStatus(true));
      window.removeEventListener("offline", updateNetworkStatus(false));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigator.onLine]);

  return { isOnline };
};

export default useNetworkStatus;
