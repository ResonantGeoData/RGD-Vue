<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { useMap, geoShape } from '@/store';
import { hint } from 'geojsonhint';

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
    const geoJsonString = ref('');
    const geoJsonErrorMessages = ref(['']);
    const isGeoJSON = (inputText: string) => {
      const validation = hint(inputText);
      geoJsonErrorMessages.value = validation.map((error: {message: string}) => error.message);
      return true;
    };
    const confirmGeoJSON = () => {
      geoShape.value = JSON.parse(geoJsonString.value).geometry;
    };
    return {
      useMap,
      clearShape,
      geoJsonShape,
      geoOptions,
      geoJsonString,
      geoJsonErrorMessages,
      isGeoJSON,
      confirmGeoJSON,
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
      <div
        v-if="geoJsonShape === geoOptions[1]"
      >
        Paste GeoJSON contents below.
        <v-spacer />
        <v-textarea
          v-model="geoJsonString"
          autofocus
          clearablecolor="primary"
          :rules="[isGeoJSON]"
          :messages="geoJsonErrorMessages"
        />
        <v-btn
          v-if="geoJsonErrorMessages.length === 0"
          color="#188DC8"
          block
          class="mt-3"
          @click="confirmGeoJSON"
        >
          Confirm GeoJSON search area
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
