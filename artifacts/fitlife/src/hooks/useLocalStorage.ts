import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useLocalSet<T>(key: string) {
  const [storedArray, setStoredArray] = useLocalStorage<T[]>(key, []);

  const add = (item: T) => {
    setStoredArray((prev) => Array.from(new Set([...prev, item])));
  };

  const remove = (item: T) => {
    setStoredArray((prev) => prev.filter((i) => i !== item));
  };

  const has = (item: T) => storedArray.includes(item);

  return { items: storedArray, add, remove, has };
}
