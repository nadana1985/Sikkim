import { useState, useEffect } from 'react';

/**
 * Debounce a value by `delay` ms. Useful for search inputs to avoid
 * firing on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
