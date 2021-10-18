<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';

export default defineComponent({
  name: 'LatLongForm',

  setup() {
    const inputs = reactive({
      longitude: null,
      latitude: null,
      height: null,
    });

    return {
      inputs,
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
      cols="5"
      class="mr-3 mt-3"
    >
      <v-text-field
        v-model.number="inputs.longitude"
        label="Longitude(deg)"
        outlined
      />
    </v-col>
    <v-col
      cols="5"
      class="ml-3 mt-3"
    >
      <v-text-field
        v-model.number="inputs.latitude"
        label="Latitude(deg)"
        outlined
      />
    </v-col>
    <v-col
      cols="9"
      class="pl-1 pr-4"
    >
      <v-text-field
        v-model.number="inputs.height"
        label="Height (m)"
        outlined
      />
    </v-col>
    <v-btn
      type="submit"
      color="teal accent-4"
      min-height="56px"
      max-width="56px"
      min-width="unset"
    >
      <v-icon
        large
      >
        mdi-crosshairs-gps
      </v-icon>
    </v-btn>
  </v-row>
</template>
