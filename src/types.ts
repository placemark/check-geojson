import { GeoJSON } from 'geojson';

export type GeoJSONTypeSet = Set<GeoJSON['type']>;

export const GEOJSON_GEOMETRY_TYPES = new Set<GeoJSON['type']>([
  'Point',
  'MultiPoint',
  'Polygon',
  'MultiPolygon',
  'LineString',
  'MultiLineString',
  'GeometryCollection',
]);

export const GEOJSON_TYPES = new Set<GeoJSON['type']>([
  ...GEOJSON_GEOMETRY_TYPES,
  'Feature',
  'FeatureCollection',
]);
