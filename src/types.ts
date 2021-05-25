import { GeoJSON } from 'geojson';

export type GeoJSONTypeSet = Set<GeoJSON['type']>;

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
