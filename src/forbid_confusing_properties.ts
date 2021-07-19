import { HintIssue, makeIssue } from './errors';
import { ObjectNode, MemberNode } from '@humanwhocodes/momoa';

type PropertiesFrom = 'Feature' | 'FeatureCollection' | 'Geometry';

function forbidProperty(
  issues: HintIssue[],
  member: MemberNode,
  propertiesFrom: PropertiesFrom,
  name: string
) {
  if (member.name.value === name) {
    issues.push(
      makeIssue(
        `${propertiesFrom} objects cannot contain a member named ${member.name.value}`,
        member.name
      )
    );
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
