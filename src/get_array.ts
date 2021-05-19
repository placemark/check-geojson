import { HintIssue } from './errors';
import { Node, ArrayNode } from '@humanwhocodes/momoa';

export function getArray(
  issues: HintIssue[],
  node: Node | null
): ArrayNode | null {
  if (node?.type === 'Array') return node;
  if (node) {
    issues.push({
      code: 'invalid_type',
      message: 'This must be an array.',
      loc: node.loc,
    });
  }
  return null;
}
