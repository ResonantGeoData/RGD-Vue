import Cesium from '@/plugins/cesium';
import { Entity } from 'cesium';
import {
  rgdImageTilesMeta, rgdCreateUrl,
  rgdTokenSignature, rgdImagery,
  rgdFootprint,
} from '@/api/rest';
import {
  visibleOverlayIds,
  footprintIds,
  visibleFootprints,
} from '@/store';
import { TileParamsType, RGDResult, GeoJsonShape } from '@/store/types';
import { ref, watch }
  from '@vue/composition-api';

// Limit the tile requests on RGD server so that Vue app's requests aren't hung
// Cesium.RequestScheduler.requestsByServer = {
//   host: 3,
// };
Cesium.RequestScheduler.maximumRequestsPerServer = 3;

export const cesiumViewer = ref();

export const tileImageParams: Record<string, TileParamsType> = {};

const footprintEntities: Record<string, Entity> = {}; // Cesium.Entity

const tileLayers: Record<string, {alpha: number}> = {}; // Cesium.TileLayer

const generateTileProvider = async (imageId: number, index = 0) => {
  const data = await rgdImageTilesMeta(imageId);
  const tileSignature = await rgdTokenSignature(); // may need await
  const extents = data.bounds;
  const rectangle = Cesium.Rectangle.fromDegrees(
    extents.xmin, extents.ymin, extents.xmax, extents.ymax,
  );
  const tileProvider = new Cesium.UrlTemplateImageryProvider({
    url: rgdCreateUrl(`image_process/imagery/${imageId}/tiles/{z}/{x}/{y}.png?projection=EPSG:3857&band=${index}&signature=${tileSignature}`),
    subdomains: null, // We do not need or provide this in RGD
    rectangle,
  });
  return tileProvider;
};

const removeTileLayer = (spatialId: number) => {
  const layers = cesiumViewer.value.scene.imageryLayers;
  layers.remove(tileLayers[spatialId]);
  delete tileLayers[spatialId];
};

export const updateTileLayer = async (spatialId: number) => {
  const imageId = tileImageParams[spatialId].image.id;
  const { index } = tileImageParams[spatialId];

  // Purge existing tile layer for this ID
  if (visibleOverlayIds.value.indexOf(spatialId) < 0) {
    removeTileLayer(spatialId);
  }

  // Update tile layer for this ID - given imageId and band
  if (visibleOverlayIds.value.indexOf(spatialId) >= 0) {
    const tileProvider = await generateTileProvider(imageId, index);
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

watch(visibleOverlayIds, () => {
  // Remove layers not supposed to be visible
  Object.keys(tileImageParams).forEach((key: string) => {
    const spatialId = Number(key);
    if (visibleOverlayIds.value.indexOf(spatialId) < 0) {
      removeTileLayer(spatialId);
      delete tileImageParams[spatialId];
    }
  });

  // Add visible layers not present
  // eslint-disable-next-line no-unused-expressions
  visibleOverlayIds.value?.forEach(async (spatialId: number) => {
    if (!(spatialId in tileImageParams)) {
      const result = await rgdImagery(spatialId);
      tileImageParams[spatialId] = {
        image: {
          id: result.parent_raster.image_set.images[0].id as unknown as number,
          name: result.parent_raster.image_set.images[0].file.name,
        },
        index: 0,
        opacity: 1,
      };
      updateTileLayer(spatialId);
    }
  });
}, { deep: true });

export const addGeojson = (geojson: GeoJsonShape): Entity => {
  const cesiumPoints: RGDResult[] = [];
  geojson.coordinates[0].forEach((e: number[]) => {
    cesiumPoints.push(Cesium.Cartesian3.fromDegrees(e[0], e[1]));
  });
  return cesiumViewer.value.entities.add({
    polygon: {
      hierarchy: cesiumPoints,
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.fromRandom({ alpha: 0.5 }),
      ),
    },
  });
};

watch(visibleFootprints, (newFootprints, oldFootprints) => {
  Object.entries(oldFootprints).forEach(
    ([key]) => {
      if (!Object.keys(newFootprints).includes(key)) {
        // remove footprint
        if (key in footprintEntities) {
          cesiumViewer.value.entities.remove(footprintEntities[key]);
          delete footprintEntities[key];
        }
      }
    },
  );
  Object.entries(newFootprints).forEach(
    ([key, footprint]) => {
      if (!Object.keys(oldFootprints).includes(key)) {
        // add footprint
        footprintEntities[key] = addGeojson(footprint);
      }
    },
  );
});
