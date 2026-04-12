import { useEffect, useState } from "react";

export function useCountdown(initial = 3) {
  const [time, setTime] = useState(initial);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setActive(false);
          return initial;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, initial]);

  const start = () => {
    setTime(initial);
    setActive(true);
  };

  const reset = () => {
    setActive(false);
    setTime(initial);
  };

  return { time, active, start, reset };
}
