import { Node } from '@humanwhocodes/momoa';
import { HintIssue, makeIssue } from './errors';

export function arrayIsNumbers(
  issues: HintIssue[],
  elements: Node[],
  name: string
) {
  for (let element of elements) {
    if (element.type !== 'Number') {
      issues.push(
        makeIssue(`Each element in a ${name} must be a number.`, element)
      );
      return;
    }
  }
}
