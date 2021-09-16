<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  toRef,
} from '@vue/composition-api';

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
    const camera = reactive({
      position: {
        lng: -122.4175,
        lat: 37.655,
        height: 100000,
      },
      heading: 360,
      pitch: -90,
      roll: 0,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateCamera = () => {
      camera.position = ({
        lng: props.location.longitude,
        lat: props.location.latitude,
        height: props.location.height,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ready = (cesiumInstance: { Cesium: any; viewer: any }) => {
      const { Cesium, viewer } = cesiumInstance;
      viewer.entities.add({
        id: 'Check Out Cesium',
        position: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        billboard: new Cesium.BillboardGraphics({
          image: 'https://zouyaoji.top/vue-cesium/favicon.png',
          scale: 0,
        }),
      });
    };

    watch(toRef(props, 'location'), updateCamera, {
      deep: true,
    });

    return {
      camera,
      ready,
    };
  },
});

</script>
<template>
  <vc-viewer
    class="viewer"
    base-layer-picker
    :camera.sync="camera"
    @ready="ready"
  >
    <vc-layer-imagery>
      <vc-provider-imagery-openstreetmap />
    </vc-layer-imagery>
  </vc-viewer>
</template>;

<style>
  .viewer {
    width: 100%;
    max-height: 1200px !important;
  }
</style>
