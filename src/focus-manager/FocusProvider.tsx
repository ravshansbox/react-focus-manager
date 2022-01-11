import { ComponentType, useEffect, useRef } from 'react';
import { FocusContext, FocusContextValue, Node } from './FocusContext';
import { ArrowKey, arrowKeys, findNext } from './utils';

export const FocusProvider: ComponentType = ({ children }) => {
  const focusedNodeRef = useRef<Node | null>(null);
  const targetNodesRef = useRef<Node[]>([]);

  const value: FocusContextValue = {
    addNode: node => {
      targetNodesRef.current.push(node);
    },
    focusElement: element => {
      const node = targetNodesRef.current.find(targetNode => targetNode.element === element);
      if (!node) {
        return;
      }
      if (focusedNodeRef.current === node) {
        return;
      }
      if (focusedNodeRef.current?.onBlur) {
        focusedNodeRef.current.onBlur();
      }
      focusedNodeRef.current = node;
      if (node.onFocus) {
        node.onFocus();
      }
    },
    focusNode: node => {
      if (focusedNodeRef.current === node) {
        return;
      }
      if (focusedNodeRef.current?.onBlur) {
        focusedNodeRef.current.onBlur();
      }
      focusedNodeRef.current = node;
      if (node.onFocus) {
        node.onFocus();
      }
    },
    removeNode: node => {
      targetNodesRef.current.splice(targetNodesRef.current.indexOf(node), 1);
    },
  };

  useEffect(() => {
    const firstTarget = targetNodesRef.current[0];
    if (firstTarget) {
      focusedNodeRef.current = firstTarget;
      if (firstTarget.onFocus) {
        firstTarget.onFocus();
      }
    }
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const code = event.code as ArrowKey;
      if (!focusedNodeRef.current || !arrowKeys.includes(code)) {
        return;
      }
      event.preventDefault();
      const nextNode = findNext(focusedNodeRef.current, targetNodesRef.current, code);
      if (nextNode) {
        if (focusedNodeRef.current.onBlur) {
          focusedNodeRef.current.onBlur();
        }
        focusedNodeRef.current = nextNode;
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
