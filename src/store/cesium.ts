import Cesium from '@/plugins/cesium';
import {
  rgdImagery, rgdImageTilesMeta, rgdSpatialEntry, rgdCreateUrl,
  rgdTokenSignature,
} from '@/api/rest';
import {
  visibleOverlayIds,
} from '@/store';
import { ref }
  from '@vue/composition-api';

// Limit the tile requests on RGD server so that Vue app's requests aren't hung
// Cesium.RequestScheduler.requestsByServer = {
//   host: 3,
// };
Cesium.RequestScheduler.maximumRequestsPerServer = 3;

export const cesiumViewer = ref();

export const tileLayers: Record<string, number> = {}; // Cesium.TileLayer

export const generateTileProvider = async (imageId: number, band = 0) => {
  const data = await rgdImageTilesMeta(imageId);
  const tileSignature = await rgdTokenSignature(); // may need await
  const extents = data.bounds;
  const rectangle = Cesium.Rectangle.fromDegrees(
    extents.xmin, extents.ymin, extents.xmax, extents.ymax,
  );
  const tileProvider = new Cesium.UrlTemplateImageryProvider({
    url: rgdCreateUrl(`image_process/imagery/${imageId}/tiles/{z}/{x}/{y}.png?projection=EPSG:3857&band=${band}&signature=${tileSignature}`),
    subdomains: null, // We do not need or provide this in RGD
    rectangle,
  });
  return tileProvider;
};

export const updateTileLayers = () => {
  // Purge
  Object.keys(tileLayers).forEach(async (key: string) => {
    const spatialId = Number(key);
    if (visibleOverlayIds.value.indexOf(spatialId) < 0) {
      const entry = await rgdSpatialEntry(spatialId);
      if (entry.subentry_type === 'RasterMeta') {
        const layers = cesiumViewer.value.scene.imageryLayers;
        layers.remove(tileLayers[spatialId]);
        delete tileLayers[spatialId];
      }
    }
  });

  // eslint-disable-next-line no-unused-expressions
  visibleOverlayIds.value?.forEach(async (spatialId: number) => {
    if (spatialId in tileLayers) {
      return;
    }
    const entry = await rgdSpatialEntry(spatialId);
    if (entry.subentry_type === 'RasterMeta') {
      // TODO: check if present for image ID and Band
      const imagery = await rgdImagery(spatialId);
      const imageId = imagery.parent_raster.image_set.images[0].id;
      const band = 0; // TODO: get band
      const tileProvider = await generateTileProvider(imageId, band);
      const layers = cesiumViewer.value.scene.imageryLayers;
      layers.remove(tileLayers[spatialId]);
      const tileLayer = layers.addImageryProvider(tileProvider);
      tileLayers[spatialId] = tileLayer;
    }
  });
};
