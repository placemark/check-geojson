import { HintIssue } from './errors';
import { ArrayNode, NumberNode } from '@humanwhocodes/momoa';

export function enforceSamePosition(issues: HintIssue[], node: ArrayNode) {
  const first = node.elements[0] as ArrayNode;
  const last = node.elements[node.elements.length - 1] as ArrayNode;

  if (first.elements.length !== last.elements.length) {
    issues.push({
      code: 'invalid_type',
      message:
        'First and last positions of a Polygon or MultiPolygon’s ring should be the same.',
      loc: first.loc,
    });
    return;
  }

  for (let j = 0; j < first.elements.length; j++) {
    const firstValue = (first.elements[j] as NumberNode).value;
    const secondValue = (last.elements[j] as NumberNode).value;
    if (firstValue !== secondValue) {
      issues.push({
        code: 'invalid_type',
        message:
          'First and last positions of a Polygon or MultiPolygon’s ring should be the same.',
        loc: last.elements[j].loc,
      });
      return;
    }
  }
}
