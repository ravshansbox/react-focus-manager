import { createContext, useContext } from 'react';

export type Node = {
  onBlur?: () => void;
  onFocus?: () => void;
  element: HTMLElement;
};

export type FocusContextValue = {
  addNode: (node: Node) => void;
  removeNode: (node: Node) => void;
};

export const FocusContext = createContext<FocusContextValue>({
  addNode: () => {},
  removeNode: () => {},
});

export const useFocus = () => useContext(FocusContext);
