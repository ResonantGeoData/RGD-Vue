import Cesium from '@/plugins/cesium';
import {
  rgdImageTilesMeta, rgdSpatialEntry, rgdCreateUrl,
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

export const tileLayers: Record<string, any> = {}; // Cesium.TileLayer

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

export const updateTileLayer = async (spatialId: number, imageId: number, band: number) => {
  // Purge existing tile layer for this ID
  if (visibleOverlayIds.value.indexOf(spatialId) < 0) {
    const entry = await rgdSpatialEntry(spatialId);
    if (entry.subentry_type === 'RasterMeta') {
      const layers = cesiumViewer.value.scene.imageryLayers;
      layers.remove(tileLayers[spatialId]);
      delete tileLayers[spatialId];
    }
  }

  // Update tile layer for this ID - given imageId and band
  if (visibleOverlayIds.value.indexOf(spatialId) >= 0) {
    console.log('ooooooh yeah');
    const tileProvider = await generateTileProvider(imageId, band);
    const layers = cesiumViewer.value.scene.imageryLayers;
    layers.remove(tileLayers[spatialId]);
    const tileLayer = layers.addImageryProvider(tileProvider);
    tileLayers[spatialId] = tileLayer;
  }
};

export const updateTileLayerOpacity = (spatialId: number, value: number) => {
  const tileLayer = tileLayers[spatialId];
  tileLayer.alpha = value;
};

export const updateVisibleOverlay = async (spatialId: number) => {
  const entry = await rgdSpatialEntry(spatialId);
  if (entry.subentry_type === 'RasterMeta') {
    // updateVisibleOverlay
  }
  // TODO: hanlde other types
};
