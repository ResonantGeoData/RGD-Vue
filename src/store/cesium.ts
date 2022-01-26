import Cesium from '@/plugins/cesium';
import { Entity } from 'cesium';
import {
  rgdImageTilesMeta, rgdCreateUrl,
  rgdTokenSignature, rgdImagery,
} from '@/api/rest';
import {
  visibleOverlayIds,
  visibleFootprints,
} from '@/store';
import { TileParamsType, RGDResult } from '@/store/types';
import { Polygon, MultiPolygon, Position } from 'geojson';
import { ref, watch }
  from '@vue/composition-api';

// Limit the tile requests on RGD server so that Vue app's requests aren't hung
// Cesium.RequestScheduler.requestsByServer = {
//   host: 3,
// };
Cesium.RequestScheduler.maximumRequestsPerServer = 3;

export const cesiumViewer = ref();

export const tileImageParams: Record<string, TileParamsType> = {};

const footprintEntities: Record<string, Array<Entity>> = {}; // Cesium.Entity

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

export const addGeojson = (geojson: Polygon | MultiPolygon): Entity[] => {
  const makeEntity = (
    coordinates: Position[][],
    parent: Entity | undefined = undefined,
  ): Entity => {
    const cesiumPoints: RGDResult[] = [];
    coordinates[0].forEach((e: Position) => {
      cesiumPoints.push(Cesium.Cartesian3.fromDegrees(e[0], e[1]));
    });
    return cesiumViewer.value.entities.add({
      polygon: {
        hierarchy: cesiumPoints,
        parent,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromRandom({ alpha: 0.5 }),
        ),
      },
    });
  };
  if (geojson.type === 'MultiPolygon') {
    const entities: Entity[] = [];
    geojson.coordinates.forEach((a: Position[][]) => {
      entities.push(makeEntity(a));
    });
    return entities;
  }
  // geojson.type === 'Polygon'
  return [makeEntity(geojson.coordinates)];
};

watch(visibleFootprints, (newFootprints, oldFootprints) => {
  Object.entries(oldFootprints).forEach(
    ([key]) => {
      if (!Object.keys(newFootprints).includes(key)) {
        // remove footprint
        if (key in footprintEntities) {
          footprintEntities[key].forEach((entity: Entity) => {
            cesiumViewer.value.entities.remove(entity);
          });
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
        cesiumViewer.value.flyTo(footprintEntities[key], {
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-90.0),
          ),
        });
      }
    },
  );
});
