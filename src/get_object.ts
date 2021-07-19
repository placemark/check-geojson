import { HintIssue, makeIssue } from './errors';
import { Node, ObjectNode } from '@humanwhocodes/momoa';

export function getObject(
  issues: HintIssue[],
  node: Node | null
): ObjectNode | null {
  if (node?.type === 'Object') return node;
  if (node) {
    issues.push(makeIssue('This must be an object.', node));
  }
  return null;
}
