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
      cesiumViewer.value.forceResize();
      cesiumViewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-93.849688, 40.690265, 4000000),
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
  #cesiumContainer{
    width: 100% !important;
    min-height: 800px !important;
    height: 850px;
    max-height: 900px !important;
  }
</style>
