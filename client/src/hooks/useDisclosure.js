import { useState, useCallback } from "react";


export function useDisclosure(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}