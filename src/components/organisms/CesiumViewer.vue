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
      });
      cesiumViewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      });
    });
    const updateCamera = () => {
      cesiumViewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          props.location.longitude,
          props.location.latitude,
          props.location.height,
        ),
      });
    };
    watch(toRef(props, 'location'), updateCamera, {
      deep: true,
    });
  },
});
</script>
<template>
  <div id="cesiumContainer" />
</template>;

<style>
  .viewer {
    width: 100%;
    max-height: 1200px !important;
  }
</style>
