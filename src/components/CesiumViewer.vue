<template>
  <vc-viewer
    class="viewer"
    base-layer-picker
    :animation="animation"
    :timeline="timeline"
    :camera.sync="camera"
  >
    <vc-layer-imagery>
      <vc-provider-imagery-openstreetmap />
    </vc-layer-imagery>
  </vc-viewer>
</template>
<script>
export default {
  data() {
    return {
      animation: true,
      timeline: true,
      camera: {
        position: {
          lng: -122.4175,
          lat: 37.655,
          height: 100000,
        },
        heading: 360,
        pitch: -90,
        roll: 0,
      },
    };
  },
  methods: {
    ready(cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance;
      viewer.entities.add({
        id: 'Check Out Cesium',
        position: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        billboard: new Cesium.BillboardGraphics({
          image: 'https://zouyaoji.top/vue-cesium/favicon.png',
          scale: 0,
        }),
      });
    },
  },
};
</script>
<style>
  .viewer {
    width: 100%;
    height: 400px !important;
  }
</style>
