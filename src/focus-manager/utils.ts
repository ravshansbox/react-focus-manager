import { Node } from './FocusContext';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
export const arrowKeys: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
type ArrowKeyMap<T> = Record<ArrowKey, T>;
type NodeRect = { node: Node; rect: DOMRect };
type TargetValue = { target: NodeRect; value: number };

const getNodeRect = (node: Node): NodeRect => ({
  node,
  rect: node.element.getBoundingClientRect(),
});

const filterDirectionOnlyFnMap: ArrowKeyMap<(source: NodeRect) => (target: NodeRect) => boolean> = {
  ArrowUp: source => target => target.rect.bottom <= source.rect.top,
  ArrowDown: source => target => target.rect.top >= source.rect.bottom,
  ArrowLeft: source => target => target.rect.right <= source.rect.left,
  ArrowRight: source => target => target.rect.left >= source.rect.right,
} as const;

const filterDirectionOnlyTargets = (source: NodeRect, targets: NodeRect[], arrowKey: ArrowKey) => {
  return targets.filter(filterDirectionOnlyFnMap[arrowKey](source));
};

const getDistanceMap: ArrowKeyMap<(source: NodeRect, target: NodeRect) => number> = {
  ArrowUp: (source, target) => source.rect.top - target.rect.bottom,
  ArrowDown: (source, target) => target.rect.top - source.rect.bottom,
  ArrowLeft: (source, target) => source.rect.left - target.rect.right,
  ArrowRight: (source, target) => target.rect.left - source.rect.right,
} as const;

const filterNearestTargets = (source: NodeRect, targets: NodeRect[], arrowKey: ArrowKey) => {
  const getDistance = getDistanceMap[arrowKey];
  const distances: TargetValue[] = targets.map(target => ({
    target,
    value: getDistance(source, target),
  }));
  const min = distances.reduce((agg, { value }) => Math.min(agg, value), Number.MAX_SAFE_INTEGER);
  return distances.filter(({ value }) => value === min).map(({ target }) => target);
};

const getVerticalIntersectionAmount = (source: NodeRect, target: NodeRect): number => {
  return Math.min(source.rect.right, target.rect.right) - Math.max(source.rect.left, target.rect.left);
};

const getHorizontalIntersectionAmount = (source: NodeRect, target: NodeRect): number => {
  return Math.min(source.rect.bottom, target.rect.bottom) - Math.max(source.rect.top, target.rect.top);
};

const getIntersectionMap: ArrowKeyMap<(source: NodeRect, target: NodeRect) => number> = {
  ArrowUp: getVerticalIntersectionAmount,
  ArrowDown: getVerticalIntersectionAmount,
  ArrowLeft: getHorizontalIntersectionAmount,
  ArrowRight: getHorizontalIntersectionAmount,
};

const filterMostIntersectedTargets = (source: NodeRect, targets: NodeRect[], arrowKey: ArrowKey) => {
  const getIntersectionAmount = getIntersectionMap[arrowKey];
  const intersections: TargetValue[] = targets.map(target => ({
    target,
    value: getIntersectionAmount(source, target),
  }));
  const max = intersections.reduce((agg, { value }) => Math.max(agg, value), Number.MIN_SAFE_INTEGER);
  return intersections.filter(({ value }) => value === max).map(({ target }) => target);
};

export const findNext = (source: Node, targets: Node[], arrowKey: ArrowKey) => {
  const sourceRect = getNodeRect(source);
  const targetRects = targets.map(getNodeRect);
  const directionOnlyTargets = filterDirectionOnlyTargets(sourceRect, targetRects, arrowKey);
  const nearestTargets = filterNearestTargets(sourceRect, directionOnlyTargets, arrowKey);
  const mostIntersectedTargets = filterMostIntersectedTargets(sourceRect, nearestTargets, arrowKey);
  const firstTarget = mostIntersectedTargets[0];
  return firstTarget?.node;
};
