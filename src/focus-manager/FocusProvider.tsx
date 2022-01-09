import { ComponentType, useEffect, useRef } from 'react';
import { FocusContext, FocusContextValue, Node } from './FocusContext';
import { ArrowKey, arrowKeys, findNext } from './utils';

export const FocusProvider: ComponentType = ({ children }) => {
  const currentNodeRef = useRef<Node | null>(null);
  const targetNodesRef = useRef<Node[]>([]);

  const value: FocusContextValue = {
    addNode: node => {
      targetNodesRef.current.push(node);
    },
    removeNode: node => {
      targetNodesRef.current.splice(targetNodesRef.current.indexOf(node));
    },
  };

  useEffect(() => {
    const firstTarget = targetNodesRef.current[0];
    if (firstTarget) {
      currentNodeRef.current = firstTarget;
      if (firstTarget.onFocus) {
        firstTarget.onFocus();
      }
    }
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const code = event.code as ArrowKey;
      if (!currentNodeRef.current || !arrowKeys.includes(code)) {
        return;
      }
      event.preventDefault();
      const nextNode = findNext(currentNodeRef.current, targetNodesRef.current, code);
      if (nextNode) {
        if (currentNodeRef.current.onBlur) {
          currentNodeRef.current.onBlur();
        }
        currentNodeRef.current = nextNode;
        if (nextNode.onFocus) {
          nextNode.onFocus();
        }
      }
    };

    window.addEventListener('keydown', keydown);

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};
