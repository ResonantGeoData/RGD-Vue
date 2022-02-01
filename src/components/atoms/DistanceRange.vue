<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { resultsFilter } from '@/store/search';

export default defineComponent({
  name: 'DistanceRange',
  setup() {
    return {
      resultsFilter,
    };
  },
});

</script>
<template>
  <v-row>
    <template>
      <v-col
        cols="6"
      >
        <v-text-field
          v-model="resultsFilter.distance.min"
          label="Distance(min)"
          outlined
          dense
          @input="$emit('input', resultsFilter)"
        />
      </v-col>
    </template>
    <template>
      <v-col
        cols="6"
      >
        <v-text-field
          v-model="resultsFilter.distance.max"
          label="Distance(max)"
          outlined
          dense
          @input="$emit('input', resultsFilter)"
        />
      </v-col>
    </template>
  </v-row>
</template>
