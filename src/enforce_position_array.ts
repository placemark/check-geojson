import { HintIssue } from './errors';
import { enforcePosition } from './enforce_position';
import { ArrayNode } from '@humanwhocodes/momoa';

export function enforcePositionArray(
  issues: HintIssue[],
  node: ArrayNode | null,
  kind?: 'polygon' | 'linestring'
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  for (let element of node.elements) {
    if (element.type !== 'Array') {
      issues.push({
        code: 'invalid_type',
        message: 'Expected to find a position here, found another type.',
        loc: element.loc,
      });
      return;
    } else {
      enforcePosition(issues, element);
    }
  }

  switch (kind) {
    case 'linestring': {
      if (node.elements.length < 2) {
        issues.push({
          code: 'invalid_type',
          message: 'Expected to find two or more positions here.',
          loc: node.loc,
        });
      }
      break;
    }
    case 'polygon':
      if (node.elements.length < 4) {
        issues.push({
          code: 'invalid_type',
          message: 'Expected to find four or more positions here.',
          loc: node.loc,
        });
      }
      break;
  }
}
