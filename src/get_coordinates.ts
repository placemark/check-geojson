import { HintIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { getMember } from './get_member';
import { getArray } from './get_array';

export function getCoordinates(issues: HintIssue[], node: ObjectNode) {
  const coordinatesMember = getMember(issues, node, 'coordinates');
  if (!coordinatesMember) return null;
  return getArray(issues, coordinatesMember.value);
}
