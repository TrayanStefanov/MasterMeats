import { useState, useEffect } from "react";

/**
 * Simple debounce hook to delay updating a value until after a delay period.
 * Example: const debouncedValue = useDebounce(searchTerm, 400);
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
