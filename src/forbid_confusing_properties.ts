import { HintIssue } from './errors';
import { ObjectNode, MemberNode } from '@humanwhocodes/momoa';

type PropertiesFrom = 'Feature' | 'FeatureCollection' | 'Geometry';

function forbidProperty(
  issues: HintIssue[],
  member: MemberNode,
  propertiesFrom: PropertiesFrom,
  name: string
) {
  if (member.name.value === name) {
    issues.push({
      code: 'invalid_type',
      message: `${propertiesFrom} objects cannot contain a member named ${member.name.value}`,
      loc: member.name.loc,
    });
  }
}

const FORBIDDEN_PROPERTIES = {
  Geometry: ['properties', 'geometry', 'features'],
  Feature: ['features'],
  FeatureCollection: ['properties', 'coordinates'],
};

export function forbidConfusingProperties(
  issues: HintIssue[],
  node: ObjectNode,
  propertiesFrom: PropertiesFrom
) {
  for (let member of node.members) {
    for (let property of FORBIDDEN_PROPERTIES[propertiesFrom]) {
      forbidProperty(issues, member, propertiesFrom, property);
    }
  }
}
