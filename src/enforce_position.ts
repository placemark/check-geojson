import { HintIssue, makeIssue } from './errors';
import { ArrayNode } from '@humanwhocodes/momoa';

export function enforcePosition(issues: HintIssue[], node: ArrayNode | null) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  if (node.elements.length < 2 || node.elements.length > 3) {
    issues.push(
      makeIssue(
        `A position should have 2 or 3 elements - found ${node.elements.length}.`,
        node
      )
    );
  }

  for (let element of node.elements) {
    if (element.type !== 'Number') {
      issues.push(
        makeIssue('Each element in a position must be a number.', element)
      );
      return;
    }
  }
}
