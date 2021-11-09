<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { useMap, geoShape } from '@/store';

export default defineComponent({
  name: 'GeoJsonForm',

  setup() {
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
      <v-btn
        color="teal accent-4"
        block
        x-large
        class="mt-3"
        @click="useMap = true"
      >
        Use Map
      </v-btn>
    </v-col>
    <v-col
      cols="11"
      class="mt-3"
    >
      <v-text-field
        :value.sync="geoJsonShape"
        label="GeoJson"
        outlined
        clearable
        @click:clear="clearShape"
      />
    </v-col>
  </v-row>
</template>
