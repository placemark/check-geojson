import { HintIssue, makeIssue } from './errors';
import { ArrayNode, NumberNode } from '@humanwhocodes/momoa';

export function enforceSamePosition(issues: HintIssue[], node: ArrayNode) {
  const first = node.elements[0] as ArrayNode;
  const last = node.elements[node.elements.length - 1] as ArrayNode;
  const len = Math.max(first.elements.length, last.elements.length);

  for (let j = 0; j < len; j++) {
    const firstValue = (first.elements[j] as NumberNode | undefined)?.value;
    const secondValue = (last.elements[j] as NumberNode | undefined)?.value;
    if (firstValue !== secondValue) {
      issues.push(
        makeIssue(
          'First and last positions of a Polygon or MultiPolygon’s ring should be the same.',
          first
        ),
        makeIssue(
          'First and last positions of a Polygon or MultiPolygon’s ring should be the same.',
          last
        )
      );
      return;
    }
  }
}
