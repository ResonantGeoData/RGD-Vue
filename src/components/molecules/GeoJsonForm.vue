<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import eventBus from '../../eventBus';

export default defineComponent({
  name: 'GeoJsonForm',

  setup() {
    return {
      eventBus,
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
        label="GeoJson"
        outlined
      />
    </v-col>
  </v-row>
</template>
