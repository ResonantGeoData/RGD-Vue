<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
}
  from '@vue/composition-api';
import Cesium from '@/plugins/cesium';
import {
  useMap, drawnShape, footPrints, specifiedShape, searchResults,
} from '@/store';

export default defineComponent({
  name: 'CesiumViewer',
  setup() {
    const polyPoints: any[] = [[]];

    const cesiumViewer = ref();
    onMounted(() => {
      // Create ProviderViewModel based on different imagery sources
      // - these can be used without Cesium Ion
      const imageryViewModels = [];

      /* Stamen's website (http://maps.stamen.com) as of 2019-08-28 says that the
       * maps they host may be used free of charge.  For http access, use a url like
       * http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png */
      const StamenAttribution = 'Map tiles by <a href="http://stamen.com">Stamen '
        + 'Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">'
        + 'CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap'
        + '</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

      /* Per Carto's website regarding basemap attribution: https://carto.com/help/working-with-data/attribution/#basemaps */
      const CartoAttribution = 'Map tiles by <a href="https://carto.com">Carto</a>, under CC BY 3.0. Data by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.';

      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'OpenStreetMap',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
        tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.\nhttp://www.openstreetmap.org',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: 'abc',
            minimumLevel: 0,
            maximumLevel: 19,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Positron',
        tooltip: 'CartoDB Positron basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/light_all/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Positron without labels',
        tooltip: 'CartoDB Positron without labels basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/rastertiles/light_nolabels/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Dark Matter',
        tooltip: 'CartoDB Dark Matter basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/rastertiles/dark_all/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Dark Matter without labels',
        tooltip: 'CartoDB Dark Matter without labels basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Voyager',
        tooltip: 'CartoDB Voyager basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Voyager without labels',
        tooltip: 'CartoDB Voyager without labels basemap',
        iconUrl: 'http://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
            credit: CartoAttribution,
            minimumLevel: 0,
            maximumLevel: 18,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'National Map Satellite',
        iconUrl: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/4/6/4',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
            credit: 'Tile data from <a href="https://basemap.nationalmap.gov/">USGS</a>',
            minimumLevel: 0,
            maximumLevel: 16,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Stamen Terrain',
        iconUrl: 'https://stamen-tiles-a.a.ssl.fastly.net/terrain/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
            credit: StamenAttribution,
            subdomains: 'abcd',
            minimumLevel: 0,
            maximumLevel: 14,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Stamen Terrain Background',
        iconUrl: 'https://stamen-tiles-a.a.ssl.fastly.net/terrain-background/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png',
            credit: StamenAttribution,
            subdomains: 'abcd',
            minimumLevel: 0,
            maximumLevel: 14,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Stamen Toner',
        iconUrl: 'https://stamen-tiles-a.a.ssl.fastly.net/toner/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
            credit: StamenAttribution,
            subdomains: 'abcd',
            minimumLevel: 0,
            maximumLevel: 14,
          });
        },
      }));
      imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Stamen Toner Lite',
        iconUrl: 'https://stamen-tiles-a.a.ssl.fastly.net/toner-lite/5/15/12.png',
        creationFunction() {
          return new Cesium.UrlTemplateImageryProvider({
            url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
            credit: StamenAttribution,
            subdomains: 'abcd',
            minimumLevel: 0,
            maximumLevel: 14,
          });
        },
      }));

      // Initialize the viewer - this works without a token
      cesiumViewer.value = new Cesium.Viewer('cesiumContainer', {
        // imageryProvider: false,
        imageryProviderViewModels: imageryViewModels,
        selectedImageryProviderViewModel: imageryViewModels[0],
        animation: false,
        timeline: false,
        infoBox: false,
        homeButton: false,
        fullscreenButton: false,
        selectionIndicator: false,
      });
      // Remove the Terrain section of the baseLayerPicker
      cesiumViewer.value.baseLayerPicker.viewModel.terrainProviderViewModels.removeAll();

      cesiumViewer.value.forceResize();
      cesiumViewer.value.camera.setView({
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
              color: Cesium.Color.GREY,
              pixelSize: 10,
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
                Cesium.Color.RED.withAlpha(0.7),
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
        handler.setInputAction((event: { endPosition: any }) => {
          if (Cesium.defined(floatingPoint)) {
            const newPosition = cesiumViewer.value.camera.pickEllipsoid(event.endPosition);
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
          useMap.value = false;
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
          drawnShape.value.type = 'Polygon';
          drawnShape.value.coordinates = polyPoints;
          terminateShape();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      }
    });

    watch(specifiedShape, () => {
      const uploadedFootPrint: any[] = [];
      specifiedShape.value.coordinates[0].forEach((e: any) => {
        uploadedFootPrint.push(Cesium.Cartesian3.fromDegrees(e[0], e[1]));
      });
      cesiumViewer.value.entities.add({
        polygon: {
          hierarchy: uploadedFootPrint,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.RED,
          ),
        },
      });
    }, { deep: true });

    watch(searchResults, () => {
      // eslint-disable-next-line no-unused-expressions
      footPrints.value?.forEach((element: { coordinates: any }) => {
        const cesiumPoints: any [] = [];
        element.coordinates[0].forEach((e: any) => {
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

    return {
      useMap,
    };
  },
});
</script>

<template>
  <div
    id="cesiumContainer"
    :class="useMap? 'draw-mode': ''"
  />
</template>

<style>
  #cesiumContainer{
    width: 100% !important;
    height: calc(100vh - 48px) !important;
    cursor: grab;
  }
  #cesiumContainer.draw-mode{
    cursor: crosshair
  }
</style>
