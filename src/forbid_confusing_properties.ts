import { makeIssue } from './errors';
import { ObjectNode, MemberNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

type PropertiesFrom = 'Feature' | 'FeatureCollection' | 'Geometry';

function forbidProperty(
  ctx: Ctx,
  member: MemberNode,
  propertiesFrom: PropertiesFrom,
  name: string
) {
  if (member.name.value === name) {
    ctx.issues.push(
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
} as const;

export function forbidConfusingProperties(
  ctx: Ctx,
  node: ObjectNode,
  propertiesFrom: PropertiesFrom
) {
  for (const member of node.members) {
    for (const property of FORBIDDEN_PROPERTIES[propertiesFrom]) {
      forbidProperty(ctx, member, propertiesFrom, property);
    }
  }
}
