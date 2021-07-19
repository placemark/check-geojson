import { HintIssue, makeIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { getArray } from './get_array';
import { arrayIsNumbers } from './array_is_numbers';

export function enforceBbox(issues: HintIssue[], node: ObjectNode) {
  const member = node.members.find(member => {
    return member.name.value === 'bbox';
  });

  // bboxes are optional
  if (member === undefined) return;

  const array = getArray(issues, member.value);

  if (!array) return;

  if (!(array.elements.length === 4 || array.elements.length === 6)) {
    issues.push(makeIssue('A bbox must have 4 or 6 positions', array));
  }

  arrayIsNumbers(issues, array.elements, 'bbox');
}
