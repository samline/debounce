import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, wait: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, wait]);

  return debouncedValue;
};
