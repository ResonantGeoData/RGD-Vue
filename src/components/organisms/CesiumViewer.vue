<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';

import Cesium from '@/plugins/cesium';

export default defineComponent({
  name: 'CesiumViewer',

  setup() {
    const cesiumViewer = ref(null);

    onMounted(() => {
      cesiumViewer.value = new Cesium.Viewer('cesiumContainer');
    });

    return {};
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
