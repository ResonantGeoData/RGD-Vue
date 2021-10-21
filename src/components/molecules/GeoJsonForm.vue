<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import eventBus from '../../eventBus';

export default defineComponent({
  name: 'GeoJsonForm',

  setup() {
    // eslint-disable-next-line no-var
    var geoJsonShape = ref();
    eventBus.$on('geo-shape', (geoShape: any) => {
      geoJsonShape.value = JSON.stringify(geoShape);
    });
    return {
      eventBus,
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
        @click="eventBus.$emit('geo-map', $event)"
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
      />
    </v-col>
  </v-row>
</template>
