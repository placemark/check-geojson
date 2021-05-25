import { GeoJSONTypeSet } from './types';
import { GeoJSON } from 'geojson';
import { HintIssue, HintError } from './errors';
import { Node } from '@humanwhocodes/momoa';

export function getType(
  issues: HintIssue[],
  node: Node,
  allowedTypes: GeoJSONTypeSet
) {
  if (node.type !== 'Object') {
    throw new HintError([
      {
        code: 'invalid_type',
        message: 'Expected an object, but found an incorrect type.',
        loc: node.loc,
      },
    ]);
  }

  const typeMember = node.members.find(member => {
    return member.name.value === 'type';
  });

  if (!typeMember) {
    throw new HintError([
      {
        code: 'invalid_type',
        message: 'This GeoJSON object is missing its type member.',
        loc: node.loc,
      },
    ]);
  }

  const value = typeMember.value;

  if (value.type !== 'String') {
    issues.push({
      code: 'invalid_type',
      message: 'The type member should have been a string.',
      loc: value.loc,
    });

    return {};
  }

  if (!allowedTypes.has(value.value as any)) {
    issues.push({
      code: 'invalid_type',
      message: 'This type of GeoJSON object is not allowed here.',
      loc: value.loc,
    });

    return {};
  }

  return {
    type: value.value as GeoJSON['type'],
    objectNode: node,
  };
}
