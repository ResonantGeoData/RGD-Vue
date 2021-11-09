<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
}
  from '@vue/composition-api';
import Cesium from '@/plugins/cesium';
import { useMap, geoShape } from '@/store';

export default defineComponent({
  name: 'CesiumViewer',
  setup() {
    const polyPoints: any[] = [];
    const cesiumViewer = ref();
    onMounted(() => {
      cesiumViewer.value = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        terrainProvider: Cesium.createWorldTerrain(),
      });
      cesiumViewer.value.forceResize();
      cesiumViewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-93.849688, 40.690265, 4000000),
      });
    });
    watch(useMap, (val) => {
      if (!val) { return; }
      {
        cesiumViewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
        );
        const createPoint = (worldPosition: any) => {
          const point = cesiumViewer.value.entities.add({
            position: worldPosition,
            point: {
              color: Cesium.Color.WHITE,
              pixelSize: 5,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
          });
          return point;
        };
        const drawShape = (positionData: any[]) => {
          const shape = cesiumViewer.value.entities.add({
            polygon: {
              hierarchy: positionData,
              material: new Cesium.ColorMaterialProperty(
                Cesium.Color.WHITE.withAlpha(0.7),
              ),
            },
          });
          return shape;
        };

        let activeShapePoints: any[] = [];
        let activeShape: any;
        let floatingPoint: any;
        const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.value.canvas);
        handler.setInputAction((event: { position: any }) => {
          const earthPosition = cesiumViewer.value.scene.pickPosition(event.position);
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
        handler.setInputAction((event: { endPosition: any }) => {
          if (Cesium.defined(floatingPoint)) {
            const newPosition = cesiumViewer.value.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
              floatingPoint.position.setValue(newPosition);
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
        };
        handler.setInputAction((event: any) => {
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
          geoShape.value.type = 'Polygon';
          geoShape.value.coordinates = polyPoints;
          terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      }
    });
  },
});
</script>
<template>
  <div id="cesiumContainer" />
</template>;

<style>
  #cesiumContainer{
    width: 100% !important;
    min-height: 800px !important;
    height: 850px;
    max-height: 900px !important;
  }
</style>
