import { useState, useCallback } from 'react';

export function useKeyboardNavigation(itemsLength: number, onEnter?: (index: number) => void) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (itemsLength === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < itemsLength - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : itemsLength - 1));
          break;
        case 'Escape':
          e.preventDefault();
          setHighlightedIndex(-1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && onEnter) {
            onEnter(highlightedIndex);
          }
          break;
      }
    },
    [itemsLength, highlightedIndex, onEnter]
  );

  return { highlightedIndex, setHighlightedIndex, onKeyDown };
}
