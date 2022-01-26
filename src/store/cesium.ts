import Cesium from '@/plugins/cesium';
import ConstantPositionProperty from 'cesium/Source/DataSources/ConstantPositionProperty';
import { Entity, Cartesian3 } from 'cesium';
import {
  rgdImageTilesMeta, rgdCreateUrl,
  rgdTokenSignature, rgdImagery,
} from '@/api/rest';
import {
  visibleOverlayIds,
  visibleFootprints,
  useMap,
  drawnShape,
} from '@/store';
import { TileParamsType, RGDResult } from '@/store/types';
import { Polygon, MultiPolygon, Position } from 'geojson';  // eslint-disable-line
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

const polyPoints: number[][][] = [];
watch(useMap, () => {
  if (!useMap) { return; }
  {
    cesiumViewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
    const createPoint = (worldPosition: Cartesian3): Entity => {
      const point = cesiumViewer.value.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.GREY,
          pixelSize: 10,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      return point;
    };
    const drawShape = (positionData: Cartesian3[]): Entity => cesiumViewer.value.entities.add({
      polygon: {
        hierarchy: positionData,
        outline: true,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 3,
        fill: false,
      },
    });

    let activeShapePoints: Cartesian3[] = [];
    let activeShape: Entity | null;
    let floatingPoint: Entity | null;
    const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.value.canvas);
    handler.setInputAction((event: { position: Cartesian3 }) => {
      const earthPosition = cesiumViewer.value.camera.pickEllipsoid(event.position);
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          floatingPoint = createPoint(earthPosition);
          activeShapePoints.push(earthPosition);
          // eslint-disable-next-line max-len
          const dynamicPositions = new Cesium.CallbackProperty((() => new Cesium.PolygonHierarchy(activeShapePoints)), false);
          activeShape = drawShape(dynamicPositions);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction((event: { endPosition: Cartesian3 }) => {
      if (Cesium.defined(floatingPoint)) {
        const newPosition = cesiumViewer.value.camera.pickEllipsoid(event.endPosition);
        if (floatingPoint?.position && Cesium.defined(newPosition)) {
          (floatingPoint.position as ConstantPositionProperty).setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    const terminateShape = () => {
      activeShapePoints.pop();
      drawShape(activeShapePoints);
      cesiumViewer.value.entities.remove(floatingPoint);
      cesiumViewer.value.entities.remove(activeShape);
      floatingPoint = null;
      activeShape = null;
      activeShapePoints = [];
      useMap.value = false;
    };
    handler.setInputAction(() => {
      activeShapePoints.forEach((element) => {
        polyPoints.push([
          Cesium.Math.toDegrees(
            (Cesium.Cartographic.fromCartesian(element)
            ).longitude,
          ),
          Cesium.Math.toDegrees(
            (Cesium.Cartographic.fromCartesian(element)
            ).latitude,
          ),
        ]);
      });
      polyPoints.push(polyPoints[0]);
      drawnShape.value.type = 'Polygon';
      drawnShape.value.coordinates = polyPoints;
      terminateShape();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
}, { deep: true });
