<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { useMap, geoShape } from '@/store';

export default defineComponent({
  name: 'GeoJsonForm',

  setup() {
    const geoOptions = [
      'Draw on Map',
      'Copy/Paste GeoJson',
      'Upload File',
    ];
    const geoJsonShape = ref();
    watch(geoShape, () => {
      if (geoShape.value.type) {
        geoJsonShape.value = JSON.stringify(geoShape.value);
      }
    }, { deep: true });
    const clearShape = () => {
      geoShape.value = {
        type: '',
        coordinates: [],
      };
    };
    return {
      useMap,
      clearShape,
      geoJsonShape,
      geoOptions,
    };
  },
});

</script>

<template>
  <v-row
    no-gutters
    justify="center"
  >
    <v-col
      cols="11"
      class="mt-3"
    >
      <v-select
        :value.sync="geoJsonShape"
        :items="geoOptions"
        label="GeoJson"
        outlined
        clearable
        @click:clear="clearShape"
      />
      <v-btn
        color="#188DC8"
        block
        x-large
        @click="useMap = true"
      >
        Use Map
      </v-btn>
    </v-col>
    <v-col
      cols="11"
      class="mt-3"
    />
  </v-row>
</template>
