import { HintIssue, makeIssue } from './errors';
import { Node, ArrayNode } from '@humanwhocodes/momoa';

export function getArray(
  issues: HintIssue[],
  node: Node | null
): ArrayNode | null {
  if (node?.type === 'Array') return node;
  if (node) {
    issues.push(makeIssue('This must be an array.', node));
  }
  return null;
}
