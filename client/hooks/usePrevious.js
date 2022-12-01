import { useEffect, useRef } from 'react';

// This hook should only use when we want to save previous prop or state
// The return value will always return previous value
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
