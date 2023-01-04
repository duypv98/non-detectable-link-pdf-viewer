import { addListener, launch, removeListener } from "devtools-detector";
import { useEffect, useState } from "react";

export default function useDevToolsDetector() {
  const [detectedDevTools, setDetectedDevTools] = useState(false);
  useEffect(() => {
    /**
     * 
     * @param {boolean} isOpen 
     */
    const listener = (isOpen) => {
      setDetectedDevTools(isOpen);
    }
    addListener(listener);
    launch();

    return () => {
      removeListener(listener);
    }
  }, []);

  return { detectedDevTools };
}