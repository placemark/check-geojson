import {
  parse,
  evaluate,
  DocumentNode,
  Node,
  ObjectNode,
} from '@humanwhocodes/momoa';
import { GeoJSON } from 'geojson';
import { HintIssue, HintError, makeIssue } from './errors';
import {
  GeoJSONTypeSet,
  GEOJSON_TYPES,
  GEOJSON_GEOMETRY_TYPES,
  GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION,
  GEOJSON_FEATURE_TYPE,
} from './types';
import { getType } from './get_type';
import { getMemberValue } from './get_member_value';
import { getArray } from './get_array';
import { getObject } from './get_object';
import { getCoordinates } from './get_coordinates';
import { enforcePosition } from './enforce_position';
import { checkDuplicateKeys } from './check_duplicate_keys';
import {
  enforcePositionArray,
  enforcePositionArray2,
  enforcePositionArray3,
} from './enforce_position_array';
import { enforceBbox } from './enforce_bbox';
import { forbidConfusingProperties } from './forbid_confusing_properties';

type Checker = (issues: HintIssue[], node: ObjectNode) => void;

const checkGeometryShared: Checker = (issues, node) => {
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
};

const checkLineString: Checker = (issues, node) => {
  enforcePositionArray(issues, getCoordinates(issues, node), 'LineString');
  checkGeometryShared(issues, node);
};

const checkMultiLineString: Checker = (issues, node) => {
  enforcePositionArray2(issues, getCoordinates(issues, node), 'LineString');
  checkGeometryShared(issues, node);
};

const checkPolygon: Checker = (issues, node) => {
  enforcePositionArray2(issues, getCoordinates(issues, node), 'Polygon');
  checkGeometryShared(issues, node);
};

const checkMultiPolygon: Checker = (issues, node) => {
  enforcePositionArray3(issues, getCoordinates(issues, node), 'Polygon');
  checkGeometryShared(issues, node);
};

const checkPoint: Checker = (issues, node) => {
  enforcePosition(issues, getCoordinates(issues, node));
  checkGeometryShared(issues, node);
};

const checkMultiPoint: Checker = (issues, node) => {
  enforcePositionArray(issues, getCoordinates(issues, node));
  checkGeometryShared(issues, node);
};

const checkGeometryCollection: Checker = (issues, node) => {
  checkGeometryShared(issues, node);
  const geometriesMember = getArray(
    issues,
    getMemberValue(issues, node, 'geometries')
  );
  if (!geometriesMember) return;
  for (let element of geometriesMember.elements) {
    checkObject(issues, element, GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION);
  }
};

const checkFeature: Checker = (issues, node) => {
  forbidConfusingProperties(issues, node, 'Feature');
  const geometryMember = getMemberValue(issues, node, 'geometry');
  enforceBbox(issues, node);
  if (geometryMember?.type !== 'Null') {
    const geometry = getObject(issues, geometryMember);
    if (geometry) checkObject(issues, geometry, GEOJSON_GEOMETRY_TYPES);
  }

  const idMember = node.members.find(member => {
    return member.name.value === 'id';
  });
  if (
    idMember &&
    !(idMember.value.type === 'String' || idMember.value.type === 'Number')
  ) {
    issues.push(makeIssue(`The Feature id must be a string or number.`, node));
  }

  const properties = getMemberValue(issues, node, 'properties');
  if (!properties) {
    issues.push(makeIssue(`The properties member is missing.`, node));
    return;
  }

  const { type } = properties;

  if (!(type === 'Object' || type === 'Null')) {
    issues.push(
      makeIssue(`The Feature properties member can be an object or null.`, node)
    );
  }
};

const checkFeatureCollection: Checker = (issues, node) => {
  forbidConfusingProperties(issues, node, 'FeatureCollection');
  const featuresMember = getArray(
    issues,
    getMemberValue(issues, node, 'features')
  );
  if (!featuresMember) return;
  for (let feature of featuresMember.elements) {
    const obj = getObject(issues, feature);
    if (obj) {
      getType(issues, obj, GEOJSON_FEATURE_TYPE);
      checkFeature(issues, obj);
    }
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
  issues: HintIssue[],
  node: Node,
  typeSet: GeoJSONTypeSet = GEOJSON_TYPES
) {
  const { type, objectNode } = getType(issues, node, typeSet);
  if (!(type && objectNode)) return;
  checkDuplicateKeys(issues, objectNode);
  CHECKERS[type](issues, objectNode);
}

function checkInternal(
  jsonStr: string
): {
  ast: DocumentNode | undefined;
  issues: HintIssue[];
} {
  const issues: HintIssue[] = [];
  let ast;
  try {
    ast = parse(jsonStr, {
      ranges: true,
    });
    checkObject(issues, ast.body);
  } catch (e) {
    issues.push({
      message: `Invalid JSON: ${e.message}`,
      from: 0,
      to: 0,
      severity: 'error',
    });
  }

  return { ast, issues };
}

export const getIssues = (jsonStr: string): HintIssue[] => {
  return checkInternal(jsonStr).issues;
};

export const check = (jsonStr: string): GeoJSON => {
  const { issues, ast } = checkInternal(jsonStr);
  if (issues.length || !ast) throw new HintError(issues);
  return evaluate(ast);
};

export { HintError, HintIssue };
