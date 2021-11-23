<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
}
  from '@vue/composition-api';
import Cesium from '@/plugins/cesium';
import { useMap, geoShape, searchResults } from '@/store';
import { rgdFootprint } from '@/api/rest';

export default defineComponent({
  name: 'CesiumViewer',
  setup() {
    const polyPoints: any[] = [[]];
    const footPrints = ref();

    const cesiumViewer = ref();
    onMounted(() => {
      // Create ProviderViewModel based on different imagery sources
      // - these can be used without Cesium Ion
      var imageryViewModels = [];
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Open\u00adStreet\u00adMap',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
        tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
      map of the world.\nhttp://www.openstreetmap.org',
        creationFunction: function() {
          return new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          });
        }
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Positron',
        tooltip: 'CartoDB Positron basemap',
        // iconUrl: Cesium.buildModuleUrl(),
        creationFunction: function() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            iconUrl: 'http://a.basemaps.cartocdn.com/light_all/5/15/12.png',
            credit: 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
          });
        }
      }));

      // Initialize the viewer - this works without a token
      cesiumViewer.value = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: false,
        imageryProviderViewModels: imageryViewModels,
        selectedImageryProviderViewModel: imageryViewModels[0],
        mapProjection: new Cesium.WebMercatorProjection(),
        animation: false,
        timeline: false,
        infoBox: false,
        homeButton: false,
        fullscreenButton: false,
        selectionIndicator: false,
      });
      // Remove the Terrain section of the baseLayerPicker
      viewer.baseLayerPicker.viewModel.terrainProviderViewModels.removeAll()

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
            polyPoints[0].push([
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
          polyPoints[0].push(polyPoints[0][0]);
          geoShape.value.type = 'Polygon';
          geoShape.value.coordinates = polyPoints;
          terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      }
    });
    const getFootPrints = async () => {
      const resArray: any[] = [];
      // eslint-disable-next-line no-unused-expressions
      searchResults.value?.forEach(async (element) => {
        const res = await rgdFootprint(element.spatial_id);
        resArray.push(res.data);
      });
      footPrints.value = resArray;
    };
    // TODO double check footprints
    // likely better way to call this
    // also double check inputs
    watch(searchResults, getFootPrints);
    watch(footPrints, () => {
      // eslint-disable-next-line no-unused-expressions
      footPrints.value?.forEach((element: { footprint: { coordinates: any } }) => {
        const cesiumPoints: any [] = [];
        element.footprint.coordinates[0].forEach((e: any) => {
          cesiumPoints.push(Cesium.Cartesian3.fromDegrees(e[0], e[1]));
        });
        cesiumViewer.value.entities.add({
          polygon: {
            hierarchy: cesiumPoints,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.fromRandom(),
            ),
          },
        });
      });
    }, { deep: true });
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
    height: 900px;
    max-height: 900px !important;
  }
</style>
