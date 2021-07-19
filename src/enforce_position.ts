import { HintIssue, makeIssue } from './errors';
import { ArrayNode } from '@humanwhocodes/momoa';
import { arrayIsNumbers } from './array_is_numbers';

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

  arrayIsNumbers(issues, node.elements, 'position');
}
