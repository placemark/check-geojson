import { GeoJSON } from 'geojson';

export type GeoJSONTypeSet = Set<GeoJSON['type']>;

export interface HintIssue {
  from: number;
  to: number;
  node?: Node;
  severity: 'error';
  message: string;
}

export interface Ctx {
  issues: HintIssue[];
  valid: Array<undefined | HintIssue[]>;
}

export const GEOJSON_FEATURE_TYPE = new Set<GeoJSON['type']>(['Feature']);

export const GEOJSON_GEOMETRY_TYPES = new Set<GeoJSON['type']>([
  'Point',
  'MultiPoint',
  'Polygon',
  'MultiPolygon',
  'LineString',
  'MultiLineString',
  'GeometryCollection',
]);

export const GEOJSON_GEOMETRY_TYPES_EX_GEOMETRY_COLLECTION = new Set<
  GeoJSON['type']
>([
  'Point',
  'MultiPoint',
  'Polygon',
  'MultiPolygon',
  'LineString',
  'MultiLineString',
]);

export const GEOJSON_TYPES = new Set<GeoJSON['type']>([
  ...GEOJSON_GEOMETRY_TYPES,
  'Feature',
  'FeatureCollection',
]);
