import { parse, evaluate, Node, ObjectNode } from '@humanwhocodes/momoa';
import { GeoJSON } from 'geojson';
import { HintIssue, HintError } from './errors';
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

function checkLineString(issues: HintIssue[], node: ObjectNode) {
  enforcePositionArray(issues, getCoordinates(issues, node), 'LineString');
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkMultiLineString(issues: HintIssue[], node: ObjectNode) {
  enforcePositionArray2(issues, getCoordinates(issues, node), 'LineString');
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkPolygon(issues: HintIssue[], node: ObjectNode) {
  enforcePositionArray2(issues, getCoordinates(issues, node), 'Polygon');
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkMultiPolygon(issues: HintIssue[], node: ObjectNode) {
  enforcePositionArray3(issues, getCoordinates(issues, node), 'Polygon');
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkPoint(issues: HintIssue[], node: ObjectNode) {
  enforcePosition(issues, getCoordinates(issues, node));
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkMultiPoint(issues: HintIssue[], node: ObjectNode) {
  enforcePositionArray(issues, getCoordinates(issues, node));
  enforceBbox(issues, node);
  forbidConfusingProperties(issues, node, 'Geometry');
}

function checkGeometryCollection(issues: HintIssue[], node: ObjectNode) {
  forbidConfusingProperties(issues, node, 'Geometry');
  enforceBbox(issues, node);
  const geometriesMember = getArray(
    issues,
    getMemberValue(issues, node, 'geometries')
  );
  if (!geometriesMember) return;
  for (let element of geometriesMember.elements) {
    checkObject(issues, element, GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION);
  }
}

function checkFeature(issues: HintIssue[], node: ObjectNode) {
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
    issues.push({
      code: 'invalid_type',
      message: `The Feature id must be a string or number.`,
      loc: idMember.loc,
    });
  }

  const properties = getMemberValue(issues, node, 'properties');
  if (!properties) {
    issues.push({
      code: 'invalid_type',
      message: `The properties member is missing.`,
      loc: node.loc,
    });
    return;
  }

  const { type } = properties;

  if (!(type === 'Object' || type === 'Null')) {
    issues.push({
      code: 'invalid_type',
      message: `The Feature properties member can be an object or null.`,
      loc: node.loc,
    });
  }
}

function checkFeatureCollection(issues: HintIssue[], node: ObjectNode) {
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
}

const CHECKERS: Record<
  GeoJSON['type'],
  (arg0: HintIssue[], arg1: ObjectNode) => void
> = {
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

export const check = (jsonStr: string): GeoJSON => {
  const issues: HintIssue[] = [];
  let ast;
  try {
    ast = parse(jsonStr, {
      ranges: true,
    });
  } catch (e) {
    issues.push({
      code: 'invalid_type',
      loc: {
        start: {
          line: e.line,
          column: e.column,
          offset: 0,
        },
        end: {
          line: e.line,
          column: e.column,
          offset: 0,
        },
      },
    });
  }
  if (ast) checkObject(issues, ast.body);
  if (issues.length || !ast) throw new HintError(issues);
  return evaluate(ast);
};

export { HintError };
