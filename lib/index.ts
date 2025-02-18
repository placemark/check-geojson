import {
  parse,
  evaluate,
  DocumentNode,
  Node,
  ObjectNode,
} from '@humanwhocodes/momoa';
import { GeoJSON } from 'geojson';
import { HintError, makeIssue } from './errors';
import {
  GeoJSONTypeSet,
  GEOJSON_TYPES,
  GEOJSON_GEOMETRY_TYPES,
  GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION,
  GEOJSON_FEATURE_TYPE,
  HintIssue,
  Ctx,
} from './types';
import { getType } from './get_type';
import { getMemberValue } from './get_member_value';
import { getArray } from './get_array';
import { getObject } from './get_object';
import { enforcePosition } from './enforce_position';
import { checkDuplicateKeys } from './check_duplicate_keys';
import {
  enforcePositionArray,
  enforcePositionArray2,
  enforcePositionArray3,
} from './enforce_position_array';
import { enforceBbox } from './enforce_bbox';
import { forbidConfusingProperties } from './forbid_confusing_properties';

type Checker = (ctx: Ctx, node: ObjectNode) => void;

function getCoordinates(ctx: Ctx, node: ObjectNode) {
  const coordinatesMember = getMemberValue(ctx, node, 'coordinates');
  if (!coordinatesMember) return null;
  return getArray(ctx, coordinatesMember);
}

const checkGeometryShared: Checker = (ctx, node) => {
  enforceBbox(ctx, node);
  forbidConfusingProperties(ctx, node, 'Geometry');
};

const checkLineString: Checker = (ctx, node) => {
  enforcePositionArray(ctx, getCoordinates(ctx, node), 'LineString');
  checkGeometryShared(ctx, node);
};

const checkMultiLineString: Checker = (ctx, node) => {
  enforcePositionArray2(ctx, getCoordinates(ctx, node), 'LineString');
  checkGeometryShared(ctx, node);
};

const checkPolygon: Checker = (ctx, node) => {
  enforcePositionArray2(ctx, getCoordinates(ctx, node), 'Polygon');
  checkGeometryShared(ctx, node);
};

const checkMultiPolygon: Checker = (ctx, node) => {
  enforcePositionArray3(ctx, getCoordinates(ctx, node), 'Polygon');
  checkGeometryShared(ctx, node);
};

const checkPoint: Checker = (ctx, node) => {
  enforcePosition(ctx, getCoordinates(ctx, node));
  checkGeometryShared(ctx, node);
};

const checkMultiPoint: Checker = (ctx, node) => {
  enforcePositionArray(ctx, getCoordinates(ctx, node));
  checkGeometryShared(ctx, node);
};

const checkGeometryCollection: Checker = (ctx, node) => {
  checkGeometryShared(ctx, node);
  const geometriesMember = getArray(
    ctx,
    getMemberValue(ctx, node, 'geometries')
  );
  if (!geometriesMember) return;
  for (const element of geometriesMember.elements) {
    checkObject(ctx, element, GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION);
  }
};

const checkFeature: Checker = (ctx, node) => {
  forbidConfusingProperties(ctx, node, 'Feature');
  const geometryMember = getMemberValue(ctx, node, 'geometry');
  enforceBbox(ctx, node);
  if (geometryMember?.type !== 'Null') {
    const geometry = getObject(ctx, geometryMember);
    if (geometry) checkObject(ctx, geometry, GEOJSON_GEOMETRY_TYPES);
  }

  const idMember = node.members.find((member) => {
    return member.name.value === 'id';
  });
  if (
    idMember &&
    !(idMember.value.type === 'String' || idMember.value.type === 'Number')
  ) {
    ctx.issues.push(
      makeIssue(`The Feature id must be a string or number.`, node)
    );
  }

  const properties = getMemberValue(ctx, node, 'properties');
  if (!properties) {
    ctx.issues.push(makeIssue(`The properties member is missing.`, node));
    return;
  }

  const { type } = properties;

  if (!(type === 'Object' || type === 'Null')) {
    ctx.issues.push(
      makeIssue(`The Feature properties member can be an object or null.`, node)
    );
  }
};

const checkFeatureCollection: Checker = (ctx, node) => {
  forbidConfusingProperties(ctx, node, 'FeatureCollection');
  const featuresMember = getArray(ctx, getMemberValue(ctx, node, 'features'));
  if (!featuresMember) return;
  for (const feature of featuresMember.elements) {
    const beforeCount = ctx.issues.length;
    const obj = getObject(ctx, feature);
    if (obj) {
      getType(ctx, obj, GEOJSON_FEATURE_TYPE);
      checkFeature(ctx, obj);
    }
    ctx.valid.push(
      ctx.issues.length === beforeCount
        ? undefined
        : ctx.issues.slice(beforeCount)
    );
  }
};

const CHECKERS: Record<GeoJSON['type'], Checker> = {
  LineString: checkLineString,
  MultiLineString: checkMultiLineString,

  Polygon: checkPolygon,
  MultiPolygon: checkMultiPolygon,

  Point: checkPoint,
  MultiPoint: checkMultiPoint,

  GeometryCollection: checkGeometryCollection,

  Feature: checkFeature,
  FeatureCollection: checkFeatureCollection,
};

function checkObject(
  ctx: Ctx,
  node: Node,
  typeSet: GeoJSONTypeSet = GEOJSON_TYPES
) {
  const { type, objectNode } = getType(ctx, node, typeSet);
  if (!(type && objectNode)) return;
  checkDuplicateKeys(ctx, objectNode);
  CHECKERS[type](ctx, objectNode);
}

function checkInternal(jsonStr: string): {
  ast: DocumentNode | undefined;
  ctx: Ctx;
} {
  if (typeof jsonStr !== 'string') {
    throw 'Input must be a string. (Use JSON.stringify first.)';
  }
  const ctx: Ctx = {
    issues: [],
    valid: [],
  };
  let ast;
  try {
    ast = parse(jsonStr, {
      ranges: true,
    });
    checkObject(ctx, ast.body);
  } catch (e: unknown) {
    ctx.issues.push({
      message: `Invalid JSON: ${(e as Error).message}`,
      from: 0,
      to: 0,
      severity: 'error',
    });
  }

  return { ast, ctx };
}

/**
 * Given a string of possibly valid GeoJSON data,
 * return an array of issues. This will handle invalid JSON
 * data, invalid GeoJSON structure, and anything else that will
 * prevent this string of data from being parsed and
 * displayed on a map.
 *
 * check-geojson looks for invalid structure and invalid syntax.
 * It does not check for complex geometry issues like
 * self-intersections, which are hard to detect and don't cause
 * failures in most display & manipulation software.
 */
export const getIssues = (jsonStr: string): HintIssue[] => {
  return checkInternal(jsonStr).ctx.issues;
};

/**
 * This catches the same issues as `getIssues`, but instead
 * of returning a list of issues, it will throw a HintError
 * if any errors are detected, and return the parsed
 * GeoJSON as an object if no errors are.
 */
export const check = (jsonStr: string): GeoJSON => {
  const { ctx, ast } = checkInternal(jsonStr);
  if (ctx.issues.length || !ast) throw new HintError(ctx.issues);
  return evaluate(ast);
};

/**
 * This method will allow you to parse a possibly-valid
 * bit of GeoJSON data. If nothing can be parsed, it will
 * throw a HintError. However, if the GeoJSON can be parsed,
 * it will return an object with valid features
 * and rejected features along with the reasons why those
 * features were rejected.
 */
export const scavenge = (
  jsonStr: string
): {
  result: GeoJSON;
  rejected: Array<{ feature: any; reasons: HintIssue[] }>;
} => {
  const {
    ctx: { issues, valid },
    ast,
  } = checkInternal(jsonStr);
  // If GeoJSON can't be parsed, throw.
  if (!ast) throw new HintError(issues);
  const result = evaluate(ast) as GeoJSON;
  // If everything was fine, return.
  if (!issues.length) return { result, rejected: [] };
  // If there were errors but it's a featurecollection, sift
  if (result.type === 'FeatureCollection') {
    return {
      result: {
        ...result,
        features: result.features.filter((_, i) => {
          return valid[i] === undefined;
        }),
      },
      rejected: result.features.flatMap((feature, i) => {
        const reasons = valid[i];
        if (reasons) {
          return [
            {
              feature,
              reasons,
            },
          ];
        }
        return [];
      }),
    };
  }
  // Otherwise, throw
  throw new HintError(issues);
};

export { HintError, HintIssue };
