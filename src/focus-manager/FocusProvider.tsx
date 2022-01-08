import { ComponentType, useEffect, useRef, useState } from 'react';
import { FocusContext, FocusContextValue, Node } from './FocusContext';
import { ArrowKey, arrowKeys, findNext } from './utils';

export const FocusProvider: ComponentType = ({ children }) => {
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const targetNodesRef = useRef<Node[]>([]);

  const value: FocusContextValue = {
    getFocused: () => currentNode && currentNode.ref,
    add: node => {
      targetNodesRef.current.push(node);
    },
    remove: node => {
      targetNodesRef.current.splice(targetNodesRef.current.indexOf(node));
    },
  };

  useEffect(() => {
    const firstTarget = targetNodesRef.current[0];
    if (firstTarget) {
      setCurrentNode(firstTarget);
      if (firstTarget.onFocus) {
        firstTarget.onFocus();
      }
    }
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const code = event.code as ArrowKey;
      if (!currentNode || !arrowKeys.includes(code)) {
        return;
      }
      event.preventDefault();
      const nextNode = findNext(currentNode, targetNodesRef.current, code);
      if (nextNode) {
        if (currentNode.onBlur) {
          currentNode.onBlur();
        }
        setCurrentNode(nextNode);
        if (nextNode.onFocus) {
          nextNode.onFocus();
        }
      }
    };

    window.addEventListener('keydown', keydown);

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, [currentNode]);

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};
