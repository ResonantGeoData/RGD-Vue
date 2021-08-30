<script lang="ts">
import { defineComponent, ref, reactive } from '@vue/composition-api';

export default defineComponent({
  name: 'CesiumViewer',

  setup() {
    const animation = ref(true);
    const timeline = ref(true);
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

    return {
      animation,
      timeline,
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
    :animation="animation"
    :timeline="timeline"
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
    height: 400px !important;
  }
</style>
