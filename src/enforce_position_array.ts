import { HintIssue, makeIssue } from './errors';
import { enforcePosition } from './enforce_position';
import { enforceSamePosition } from './enforce_same_position';
import { Node, ArrayNode } from '@humanwhocodes/momoa';

function getArray(issues: HintIssue[], node: Node): ArrayNode | null {
  if (node.type !== 'Array') {
    issues.push(
      makeIssue('Expected to find an array of positions here.', node)
    );
    return null;
  }
  return node;
}

type PositionKind = 'Polygon' | 'LineString';

export function enforcePositionArray(
  issues: HintIssue[],
  node: Node | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(issues, node);
  if (!node) return;

  for (let element of node.elements) {
    if (element.type !== 'Array') {
      issues.push(
        makeIssue(
          'Expected to find a position here, found another type.',
          element
        )
      );
      return;
    } else {
      enforcePosition(issues, element);
    }
  }

  switch (kind) {
    case 'LineString': {
      if (node.elements.length < 2) {
        issues.push(
          makeIssue('Expected to find two or more positions here.', node)
        );
      }
      break;
    }
    case 'Polygon':
      if (node.elements.length < 4) {
        issues.push(
          makeIssue('Expected to find four or more positions here.', node)
        );
      }
      enforceSamePosition(issues, node);
      break;
  }
}

export function enforcePositionArray2(
  issues: HintIssue[],
  node: Node | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(issues, node);
  if (!node) return;

  for (let element of node.elements) {
    enforcePositionArray(issues, element, kind);
  }
}

export function enforcePositionArray3(
  issues: HintIssue[],
  node: ArrayNode | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(issues, node);
  if (!node) return;

  for (let element of node.elements) {
    enforcePositionArray2(issues, element, kind);
  }
}
