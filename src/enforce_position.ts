import { HintIssue } from './errors';
import { ArrayNode } from '@humanwhocodes/momoa';

export function enforcePosition(issues: HintIssue[], node: ArrayNode) {
  if (node.elements.length < 2 || node.elements.length > 3) {
    issues.push({
      code: 'invalid_type',
      message: 'A position should have 2 or 3 elements.',
      loc: node.loc,
    });
  }

  for (let element of node.elements) {
    if (element.type !== 'Number') {
      issues.push({
        code: 'invalid_type',
        message: 'Each element in a position must be a number.',
        loc: element.loc,
      });
      return;
    }
  }
}
