import { makeIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { getArray } from './get_array';
import { arrayIsNumbers } from './array_is_numbers';
import { Ctx } from './types';

export function enforceBbox(ctx: Ctx, node: ObjectNode) {
  const member = node.members.find((member) => {
    return member.name.value === 'bbox';
  });

  // bboxes are optional
  if (member === undefined) return;

  const array = getArray(ctx, member.value);

  if (!array) return;

  if (!(array.elements.length === 4 || array.elements.length === 6)) {
    ctx.issues.push(makeIssue('A bbox must have 4 or 6 positions', array));
  }

  arrayIsNumbers(ctx, array.elements, 'bbox');
}
