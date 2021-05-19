import { HintIssue, HintError } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';

export function getCoordinates(issues: HintIssue[], node: ObjectNode) {
  const coordinatesMember = node.members.find(member => {
    return member.name.value === 'coordinates';
  });

  if (!coordinatesMember) {
    throw new HintError([
      {
        code: 'invalid_type',
        message:
          'This GeoJSON object requires a coordinates member but it is missing.',
        loc: node.loc,
      },
    ]);
  }

  const value = coordinatesMember.value;

  if (value.type !== 'Array') {
    issues.push({
      code: 'invalid_type',
      message: 'The coordinates member must be an array.',
      loc: value.loc,
    });

    return null;
  }

  return value;
}
