import { HintIssue } from './errors';
import { Node, ObjectNode } from '@humanwhocodes/momoa';

export function getObject(
  issues: HintIssue[],
  node: Node | null
): ObjectNode | null {
  if (node?.type === 'Object') return node;
  if (node) {
    issues.push({
      message: 'This must be an object.',
      severity: 'error',
      from: node.loc.start.offset,
      to: node.loc.end.offset,
    });
  }
  return null;
}
