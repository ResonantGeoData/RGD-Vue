import Cesium from '@/plugins/cesium';
import { ref } from '@vue/composition-api';
import { Polygon, MultiPolygon, Position } from 'geojson';  // eslint-disable-line
import { GeoJsonDataSource } from 'cesium';

// Limit the tile requests on RGD server so that Vue app's requests aren't hung
// Cesium.RequestScheduler.requestsByServer = {
//   host: 3,
// };
Cesium.RequestScheduler.maximumRequestsPerServer = 3;

export const cesiumViewer = ref();

export const addGeojson = async (geojson: Polygon | MultiPolygon): Promise<GeoJsonDataSource> => {
  // cesiumViewer.value.dataSources.remove(source);
  const source = await cesiumViewer.value.dataSources.add(
    Cesium.GeoJsonDataSource.load(geojson),
  );
  // Change display properties for all entities in data source
  /* eslint-disable no-param-reassign */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source.entities.values.forEach((entity: {polygon: any}) => {
    entity.polygon.outline = true;
    entity.polygon.fill = false;
    entity.polygon.outlineColor = Cesium.Color.fromRandom({ alpha: 0.5 });
    entity.polygon.outlineWidth = 3; // WebGL issue - doesn't do anything
  });
  /* eslint-enable no-param-reassign */

  return source;
};
