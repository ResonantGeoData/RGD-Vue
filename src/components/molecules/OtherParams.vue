<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'OtherParams',
  setup() {
    const predicate = [
      'within',
      'contains',
      'crosses',
      'disjoint',
      'equals',
      'intersects',
      'overlaps',
      'touches',
    ];

    return {
      predicate,
    };
  },
});

</script>
<template>
  <v-row
    justify="center"
  >
    <v-col
      cols="11"
      class="mt-3"
    >
      <v-select
        :items="predicate"
        label="Predicate"
        outlined
      />
    </v-col>
  </v-row>
</template>
