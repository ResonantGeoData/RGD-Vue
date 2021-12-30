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
    >
      <v-select
        v-model="geoJsonShape"
        :items="geoOptions"
        label="Search area"
        messages="Select a method of specifying a geographical area."
        :hide-details="geoJsonShape !== undefined"
        outlined
        clearable
        @click:clear="clearShape"
      />
      <v-btn
        v-if="geoJsonShape === geoOptions[0]"
        color="#188DC8"
        block
        class="mt-3"
        @click="useMap = true"
      >
        Draw polygon on map
      </v-btn>
      <div v-if="geoJsonShape === geoOptions[0] && useMap">
        Click on the map to draw points of a polygon.
        Double click to complete the polygon selection.
      </div>
    </v-col>
  </v-row>
</template>
