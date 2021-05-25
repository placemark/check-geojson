import { HintIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { getMemberValue } from './get_member_value';
import { getArray } from './get_array';

export function getCoordinates(issues: HintIssue[], node: ObjectNode) {
  const coordinatesMember = getMemberValue(issues, node, 'coordinates');
  if (!coordinatesMember) return null;
  return getArray(issues, coordinatesMember);
}
