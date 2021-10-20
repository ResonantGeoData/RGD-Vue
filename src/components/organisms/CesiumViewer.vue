<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  toRef,
  watch,
}
  from '@vue/composition-api';
import Cesium from '@/plugins/cesium';

export default defineComponent({
  name: 'CesiumViewer',
  props: {
    location: {
      type: Object, /* TODO typescript interfaces for props */
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
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
      cesiumViewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-93.849688, 40.690265, 4000000),
      });
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
      function drawShape(positionData: any[]) {
        const shape = cesiumViewer.value.entities.add({
          polygon: {
            hierarchy: positionData,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.WHITE.withAlpha(0.7),
            ),
          },
        });
        return shape;
      }

      let activeShapePoints: any[] = [];
      let activeShape: any;
      let floatingPoint: any;
      const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.value.canvas);
      handler.setInputAction((event: { position: any }) => {
        // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
        // we get the correct point when mousing over terrain.
        const earthPosition = cesiumViewer.value.scene.pickPosition(event.position);
        // `earthPosition` will be undefined if our mouse is not over the globe.
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
      // Redraw the shape so it's not dynamic and remove the dynamic shape.
      function terminateShape() {
        activeShapePoints.pop();
        drawShape(activeShapePoints);
        cesiumViewer.value.entities.remove(floatingPoint);
        cesiumViewer.value.entities.remove(activeShape);
        floatingPoint = null;
        activeShape = null;
        activeShapePoints = [];
      }
      handler.setInputAction((event: any) => {
        terminateShape();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      cesiumViewer.value.camera.lookAt(
        Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
        new Cesium.Cartesian3(5000.0, 5000.0, 5000.0),
      );
      cesiumViewer.value.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    });
    // const updateCamera = () => {
    //   cesiumViewer.value.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(
    //       props.location.longitude,
    //       props.location.latitude,
    //       props.location.height,
    //     ),
    //   });
    // };
    // watch(toRef(props, 'location'), updateCamera, {
    //   deep: true,
    // });
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
