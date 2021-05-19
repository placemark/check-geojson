import { parse, evaluate, Node, ObjectNode } from '@humanwhocodes/momoa';
import { GeoJSON } from 'geojson';
import { HintIssue, HintError } from './errors';
import { GEOJSON_TYPES } from './types';
import { getType } from './get_type';
import { getCoordinates } from './get_coordinates';

function checkLineString(issues: HintIssue[], node: ObjectNode) {}
function checkMultiLineString(issues: HintIssue[], node: ObjectNode) {}

function checkPolygon(issues: HintIssue[], node: ObjectNode) {}
function checkMultiPolygon(issues: HintIssue[], node: ObjectNode) {}

function checkPoint(issues: HintIssue[], node: ObjectNode) {
  getCoordinates(issues, node);
}

function checkMultiPoint(issues: HintIssue[], node: ObjectNode) {}

function checkFeature(issues: HintIssue[], node: ObjectNode) {}
function checkFeatureCollection(issues: HintIssue[], node: ObjectNode) {}

function checkGeometryCollection(issues: HintIssue[], node: ObjectNode) {}

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

function checkObject(issues: HintIssue[], node: Node) {
  const { type, objectNode } = getType(issues, node, GEOJSON_TYPES);
  if (!(type && objectNode)) return;
  CHECKERS[type](issues, objectNode);
}

export const check = (jsonStr: string): GeoJSON => {
  const ast = parse(jsonStr, {
    ranges: true,
  });
  const issues: HintIssue[] = [];
  checkObject(issues, ast.body);
  if (issues.length) throw new HintError(issues);
  return evaluate(ast);
};

export { HintError };
