import { createContext, useContext } from 'react';

export type Node = {
  onBlur?: () => void;
  onFocus?: () => void;
  ref: HTMLElement;
};

export type FocusContextValue = {
  getFocused: () => HTMLElement | null;
  add: (node: Node) => void;
  remove: (node: Node) => void;
};

export const FocusContext = createContext<FocusContextValue>({
  getFocused: () => null,
  add: () => {},
  remove: () => {},
});

export const useFocus = () => useContext(FocusContext);
