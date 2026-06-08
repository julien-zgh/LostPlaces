import { useState, useEffect } from "react";

const useDebounce = <T,>(
  value: T,
  delay: number = 300,
  callback?: () => void
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (callback) {
        callback();
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);

  return debouncedValue;
};

export default useDebounce;
