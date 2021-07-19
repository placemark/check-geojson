import { GeoJSONTypeSet } from './types';
import { GeoJSON } from 'geojson';
import { HintIssue, HintError, makeIssue } from './errors';
import { Node } from '@humanwhocodes/momoa';

export function getType(
  issues: HintIssue[],
  node: Node,
  allowedTypes: GeoJSONTypeSet
) {
  if (node.type !== 'Object') {
    throw new HintError([
      {
        message: 'Expected an object, but found an incorrect type.',
        severity: 'error',
        from: node.loc.start.offset,
        to: node.loc.end.offset,
      },
    ]);
  }

  const typeMember = node.members.find(member => {
    return member.name.value === 'type';
  });

  if (!typeMember) {
    throw new HintError([
      makeIssue('This GeoJSON object is missing its type member.', node),
    ]);
  }

  const value = typeMember.value;

  if (value.type !== 'String') {
    issues.push(makeIssue('The type member should have been a string.', node));

    return {};
  }

  if (!allowedTypes.has(value.value as any)) {
    issues.push(
      makeIssue('This type of GeoJSON object is not allowed here.', node)
    );

    return {};
  }

  return {
    type: value.value as GeoJSON['type'],
    objectNode: node,
  };
}
