import { HintIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { getArray } from './get_array';

export function enforceBbox(issues: HintIssue[], node: ObjectNode) {
  const member = node.members.find(member => {
    return member.name.value === 'bbox';
  });

  // bboxes are optional
  if (member === undefined) return;

  const array = getArray(issues, member.value);

  if (!array) return;

  if (!(array.elements.length === 4 || array.elements.length === 6)) {
    issues.push({
      code: 'invalid_type',
      message: 'A bbox must have 4 or 6 positions',
      loc: array.loc,
    });
  }

  for (let element of array.elements) {
    if (element.type !== 'Number') {
      issues.push({
        code: 'invalid_type',
        message: 'Each element in a bbox must be a number.',
        loc: element.loc,
      });
      return;
    }
  }
}
