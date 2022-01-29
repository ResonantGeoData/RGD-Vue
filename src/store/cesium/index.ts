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
    Cesium.GeoJsonDataSource.load(geojson, {
      stroke: Cesium.Color.fromRandom({ alpha: 0.5 }),
    }),
  );
  return source;
};
